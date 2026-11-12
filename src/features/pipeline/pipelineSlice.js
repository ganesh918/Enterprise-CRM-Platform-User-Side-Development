import { createSlice } from "@reduxjs/toolkit";
import { initialDeals } from "../../data/seed";
import { generateId } from "../../lib/utils";
const initialState = {
  deals: initialDeals,
  loading: false,
  error: null
};
const pipelineSlice = createSlice({
  name: "pipeline",
  initialState,
  reducers: {
    moveDeal(state, action) {
      const deal = state.deals.find((d) => d.id === action.payload.id);
      if (deal) {
        deal.stage = action.payload.stage;
        deal.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        if (action.payload.stage === "closed_won") deal.probability = 100;
        if (action.payload.stage === "closed_lost") deal.probability = 0;
      }
    },
    addDeal(state, action) {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      state.deals.push({
        ...action.payload,
        id: generateId("deal"),
        createdAt: now,
        updatedAt: now
      });
    },
    updateDeal(state, action) {
      const index = state.deals.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.deals[index] = {
          ...action.payload,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
    },
    deleteDeal(state, action) {
      state.deals = state.deals.filter((d) => d.id !== action.payload);
    },
    setPipelineLoading(state, action) {
      state.loading = action.payload;
    },
    setPipelineError(state, action) {
      state.error = action.payload;
    },
    resetFromSeed(state) {
      state.deals = initialDeals;
      state.loading = false;
      state.error = null;
    }
  }
});
const {
  moveDeal,
  addDeal,
  updateDeal,
  deleteDeal,
  setPipelineLoading,
  setPipelineError,
  resetFromSeed
} = pipelineSlice.actions;
const selectAllDeals = (state) => state.pipeline.deals;
const selectDealsByStage = (stage) => (state) => state.pipeline.deals.filter((d) => d.stage === stage);
var stdin_default = pipelineSlice.reducer;
export {
  addDeal,
  stdin_default as default,
  deleteDeal,
  moveDeal,
  selectAllDeals,
  selectDealsByStage,
  setPipelineError,
  setPipelineLoading,
  updateDeal,
  resetFromSeed
};
