// hooks/useNotes.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  setNotes,
  setPreviewNote,
  setsearchNote,
  setLoading,
  setError,
} from "../note/noteSlice";
import type { Note } from "../interface/note";
import { getVisitorId } from "./helper";

const BASE_URL = "https://task-backend-gsvc.onrender.com/note";

// Custom hook for all note operations with Redux integration
export const useNotes = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const visitorIdPromise = getVisitorId(); // Get visitor ID once and reuse




  // Fetch all notes and update Redux
  const useFetchAllNotes = () => {
    return useQuery({
      queryKey: ["notes"],
      queryFn: async () => {
        dispatch(setLoading(true));
        try {
          const response = await fetch(`${BASE_URL}`, {
            headers: {
              "visitor-id": await visitorIdPromise, // Include visitor ID in headers
            },
          });
          console.log(response);

          if (!response.ok) {
            throw new Error("Failed to fetch notes");
          }
          const data = await response.json();

          console.log(data);

          // Update Redux state with fetched notes
          dispatch(setNotes(data));

          return data;
        } catch (error: any) {
          dispatch(setError(error.message));
          throw error;
        }
      },
      staleTime: 1 * 1000,
      retry: 3,
    });
  };

  // Fetch note by ID and update previewNote in Redux
  const useFetchNoteById = (id: string) => {
    return useQuery({
      queryKey: ["notes", id],
      queryFn: async () => {
        dispatch(setLoading(true));
        try {
          const response = await fetch(`${BASE_URL}/${id}`, {
            headers: {
              "Content-Type": "application/json",
              "visitor-id": await visitorIdPromise,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch note");
          }
          const data = await response.json();

          // Update Redux previewNote
          dispatch(setPreviewNote(data));

          return data;
        } catch (error: any) {
          dispatch(setError(error.message));
          throw error;
        }
      },
      enabled: !!id, // Only run if id is provided
    });
  };

  // Create note mutation and update previewNote
  const useCreateNote = () => {
    return useMutation({
      mutationFn: async (newNote: Note) => {
        dispatch(setLoading(true));
        const response = await fetch(`${BASE_URL}/create-note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "visitor-id": await visitorIdPromise,
          },
          body: JSON.stringify(newNote),
        });
        if (!response.ok) {
          throw new Error("Failed to create note");
        }
        return response.json();
      },
      onSuccess: (data) => {
        // Update Redux previewNote with created note
        dispatch(setPreviewNote(data));

        // Invalidate and refetch notes list
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      },
      onError: (error) => {
        dispatch(setError(error.message));
      },
      onSettled: () => {
        dispatch(setLoading(false));
      },
    });
  };

  // Update note mutation
  const useUpdateNote = () => {
    return useMutation({
      mutationFn: async ({
        id,
        updatedData,
      }: {
        id: string;
        updatedData: Partial<Note>;
      }) => {
        dispatch(setLoading(true));
        const response = await fetch(`${BASE_URL}/update-note/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "visitor-id": await visitorIdPromise,
          },
          body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
          throw new Error("Failed to update note");
        }
        return response.json();
      },
      onSuccess: (data, variables) => {
        // Update Redux previewNote with updated note
        dispatch(setPreviewNote(data));

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        queryClient.invalidateQueries({ queryKey: ["notes", variables.id] });
      },
      onError: (error) => {
        dispatch(setError(error.message));
      },
      onSettled: () => {
        dispatch(setLoading(false));
      },
    });
  };
  // Delete note mutation
  const useDeleteNote = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
      mutationFn: async (id: string) => {
        // It's often better to let the mutation state handle 'loading'
        // rather than manually dispatching setLoading(true),
        // but if your UI depends on global loading, this is fine.
        dispatch(setLoading(true));

        const response = await fetch(`${BASE_URL}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "visitor-id": await visitorIdPromise,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to delete note");
        }
        return id;
      },

      onSuccess: (id) => {
        dispatch(setPreviewNote(null));
        console.log(id);

        queryClient.invalidateQueries({ queryKey: ["notes"] });
      },

      onError: (error: Error) => {
        dispatch(setError(error.message));
      },

      onSettled: () => {
        dispatch(setLoading(false));
      },
    });
  };
  const useSearchNotes = () => {
    return useMutation({
      mutationFn: async (filters: { priority?: string; progress?: string }) => {
        dispatch(setLoading(true));

        // Build query parameters properly
        const params = new URLSearchParams();
        if (filters.priority) params.append("priority", filters.priority);
        if (filters.progress) params.append("progress", filters.progress);

        const url = `${BASE_URL}/priority?${params.toString()}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "visitor-id": await visitorIdPromise,
          },
        });

        // Read the response body once
        const data = await response.json();

        if (!response.ok) {
          // If the response is not ok, throw the error message from the server
          throw new Error(data.message || "Failed to search tasks");
        }

        // Success: log and return the data
        console.log(data);
        return data;
      },
      onSuccess: (data) => {
        dispatch(setsearchNote(data));
      },
      onError: (error) => {
        dispatch(setError(error.message));
      },
      onSettled: () => {
        dispatch(setLoading(false));
      },
    });
  };
  const useSearchNotesByContent = () => {
    const dispatch = useDispatch();
    // Ensure your URL is correct (e.g., http://localhost:8000/note/search)
    const url = `${BASE_URL}/search`;

    return useMutation({
      mutationFn: async (searchText: string) => {
        dispatch(setLoading(true));

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "visitor-id": await visitorIdPromise,
          },

          body: JSON.stringify({
            title: searchText,
            description: searchText,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to search tasks");
        }

        return data;
      },
      onSuccess: (data) => {
        // 'data' should be the array of notes from your backend
        dispatch(setsearchNote(data));
      },
      onError: (error: any) => {
        dispatch(setError(error.message));
      },
      onSettled: () => {
        dispatch(setLoading(false));
      },
    });
  };

  return {
    useFetchAllNotes,
    useCreateNote,
    useFetchNoteById,
    useUpdateNote,
    useDeleteNote,
    useSearchNotes,
    useSearchNotesByContent,
  };
};
