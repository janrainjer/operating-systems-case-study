import { createSlice } from "@reduxjs/toolkit";
import { IBlog } from "../../types/Blog";
import { RootState } from "../store"

// Type for our state
interface BlogState {
  allBlogs: IBlog[] | null
  currentBlog : IBlog | null
}

// Initial state
const initialState: BlogState = {
  allBlogs: null,
  currentBlog : null
};

// Actual Slice
export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    // Action to set the authentication status
    setBlog(state, action) {
      state.allBlogs = action.payload;
    },
  },
});

export const { setBlog } = blogSlice.actions;

export const selectAllBlogs = (state: RootState) => state.blog.allBlogs;

export default blogSlice.reducer;