"use client";

import { useSidebar } from "@/context/SidebarProvider";
import Sidebar from "@/views/navigation/Sidebar";
import { Box } from "@chakra-ui/react";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  return (
    <>
      <Sidebar />
      <Box
        ml={isExpanded ? { base: "0px", xl: "280px" } : "73px"}
        transition="margin-left 0.3s ease-in-out"
      >
        {children}
      </Box>
    </>
  );
}

export default Layout;
