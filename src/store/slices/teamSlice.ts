import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { teamService } from "../../services/teamService";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  lastActive: string;
  status: "Active" | "Inactive";
}

interface TeamState {
  members: TeamMember[];
  roles: any[]; // Define Role type better if possible
  isLoading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  members: [],
  roles: [],
  isLoading: false,
  error: null,
};

export const fetchTeamMembers = createAsyncThunk(
  "team/fetchMembers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await teamService.getTeamMembers();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch team members");
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "team/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const data = await teamService.getRoles();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch roles");
    }
  }
);

export const inviteAdmin = createAsyncThunk(
  "team/inviteAdmin",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (payload: any, { rejectWithValue }) => {
    try {
      await teamService.inviteAdmin(payload);
      return;
    } catch (error) {
      return rejectWithValue("Failed to invite admin");
    }
  }
);

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTeamMembers.fulfilled,
        (state, action: PayloadAction<TeamMember[]>) => {
          state.isLoading = false;
          state.members = action.payload;
        }
      )
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      });
  },
});

export default teamSlice.reducer;
