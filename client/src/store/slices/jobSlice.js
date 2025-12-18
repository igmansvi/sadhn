import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jobService } from "@/lib/services/jobService";

const initialState = {
  jobs: [],
  currentJob: null,
  myJobs: [],
  pagination: null,
  filters: {
    employmentType: "",
    workMode: "",
    search: "",
    page: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobs(filters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job"
      );
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  "jobs/fetchMyJobs",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getMyJobs(filters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.data;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentJob, clearJobError } =
  jobSlice.actions;
export default jobSlice.reducer;
