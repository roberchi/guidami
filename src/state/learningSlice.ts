import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { contentCatalog } from "../content/catalog/catalog";
import { validateCatalog } from "../content/catalog/validateCatalog";
import { buildLearningProfile } from "../domain/assessment/assessment";
import type { LearningAttempt } from "../domain/learning/types";
import type { AppSnapshot, Preferences } from "../domain/models";
import { defaultSnapshot } from "../domain/models";
import { learningRepository } from "../storage/local/LearningRepository";

interface LearningState {
  snapshot: AppSnapshot;
  status: "idle" | "loading" | "ready" | "saving" | "error";
  error?: string;
}

const initialState: LearningState = {
  snapshot: defaultSnapshot,
  status: "idle"
};

export const bootstrapApp = createAsyncThunk("learning/bootstrap", () => {
  const catalogErrors = validateCatalog(contentCatalog).filter((issue) => issue.severity === "error");
  if (catalogErrors.length > 0) {
    throw new Error("Il pacchetto dei contenuti non è valido");
  }
  return learningRepository.load();
});

export const finishAssessment = createAsyncThunk(
  "learning/finishAssessment",
  async (answers: Record<string, string>, { getState }) => {
    const state = getState() as { learning: LearningState };
    const profile = buildLearningProfile(answers, state.learning.snapshot.profile?.id);
    return learningRepository.saveAssessment(answers, profile);
  }
);

export const saveAssessmentDraft = createAsyncThunk(
  "learning/saveAssessmentDraft",
  (answers: Record<string, string>) => learningRepository.saveAssessmentDraft(answers)
);

export const updatePreferences = createAsyncThunk(
  "learning/updatePreferences",
  (preferences: Preferences) => learningRepository.savePreferences(preferences)
);

export const saveLessonCheckpoint = createAsyncThunk(
  "learning/saveLessonCheckpoint",
  (step: number) => learningRepository.saveLessonCheckpoint(step)
);

export const finishLesson = createAsyncThunk(
  "learning/finishLesson",
  (lessonId: string) => learningRepository.completeLesson(lessonId)
);

export const recordLearningAttempt = createAsyncThunk(
  "learning/recordAttempt",
  (attempt: LearningAttempt) => learningRepository.saveLearningAttempt(attempt)
);

export const importBackup = createAsyncThunk(
  "learning/importBackup",
  (serialized: string) => learningRepository.importData(serialized)
);

export const clearLocalData = createAsyncThunk("learning/clearLocalData", async () => {
  await learningRepository.deleteLocalData();
  return structuredClone(defaultSnapshot);
});

const slice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    clearError(state) {
      state.error = undefined;
    },
    setSnapshot(state, action: PayloadAction<AppSnapshot>) {
      state.snapshot = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(bootstrapApp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bootstrapApp.fulfilled, (state, action) => {
        state.status = "ready";
        state.snapshot = action.payload;
      });

    for (const thunk of [
      finishAssessment,
      saveAssessmentDraft,
      updatePreferences,
      saveLessonCheckpoint,
      finishLesson,
      recordLearningAttempt,
      importBackup,
      clearLocalData
    ]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = "saving";
          state.error = undefined;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.status = "ready";
          state.snapshot = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.status = "error";
          state.error = action.error.message ?? "Non è stato possibile salvare i dati";
        });
    }
  }
});

export const learningReducer = slice.reducer;
export const { clearError, setSnapshot } = slice.actions;
