"use client";

import { useSidebar } from "@/context/SidebarProvider";
import Sidebar from "@/views/Sidebar";
import { Box } from "@chakra-ui/react";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  return (
    <>
      <Sidebar />
      <Box
        ml={isExpanded ? { base: "0px", xl: "260px" } : "73px"}
        transition="margin-left 0.3s ease-in-out"
      >
        {children}
      </Box>
    </>
  );
}

export default Layout;
