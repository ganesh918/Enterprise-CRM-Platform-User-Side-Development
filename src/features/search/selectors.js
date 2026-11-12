import { createSelector } from "@reduxjs/toolkit";
const selectGlobalQuery = (state) => (state.ui.globalSearch || "").trim().toLowerCase();
const selectGlobalSearchResults = createSelector(
  [
    selectGlobalQuery,
    (state) => state.leads.items,
    (state) => state.customers.items,
    (state) => state.pipeline.deals,
    (state) => state.tasks.items
  ],
  (query, leads, customers, deals, tasks) => {
    if (!query) return { leads: [], customers: [], deals: [], tasks: [], total: 0 };
    const match = (value) => value.toLowerCase().includes(query);
    const leadHits = leads.filter(
      (l) => match(l.name) || match(l.company) || match(l.email) || match(l.source)
    ).slice(0, 5);
    const customerHits = customers.filter(
      (c) => match(c.name) || match(c.company) || match(c.industry) || match(c.location)
    ).slice(0, 5);
    const dealHits = deals.filter((d) => match(d.title) || match(d.company)).slice(0, 5);
    const taskHits = tasks.filter((t) => match(t.title) || match(t.description)).slice(0, 5);
    const total = leadHits.length + customerHits.length + dealHits.length + taskHits.length;
    return {
      leads: leadHits,
      customers: customerHits,
      deals: dealHits,
      tasks: taskHits,
      total
    };
  }
);
export {
  selectGlobalSearchResults
};
