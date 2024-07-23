import { defineStore } from "pinia";

export const useSidebarStore = defineStore({
  id: "sidebar",
  state: () => ({
    isOpen: false,
  }),
  actions: {
    toggleSidebar() {
      // Toggle the sidebar
      this.isOpen = !this.isOpen;
    },
    closeSidebar() {
      // Close the sidebar
      this.isOpen = false;
    },
    openSidebar() {
      // Open the sidebar
      this.isOpen = true;
    },
  },
});
