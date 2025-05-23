"use client";

import Image from "next/image";

import { useColorModeValue } from "@/components/ui/color-mode";
import { useSidebar } from "@/context/SidebarProvider";

import { IconButton, useBreakpointValue, Box, Icon } from "@chakra-ui/react";
import { LuSquareArrowLeft } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";

import SidebarRoutes from "./SidebarRoutes";
import { usePathname } from "next/navigation";

const Sidebar = () => {

  const { isExpanded, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const isMobile = useBreakpointValue({ base: true, xl: false }); // Check if the screen size is mobile
  const shouldHideSidebar =
    pathname === "/login";

  // For Desktop
  const sidebarWidth = useBreakpointValue({
    base: "0px",
    xl: isExpanded ? "280px" : "73px",
  });

  const bg = useColorModeValue("#fff", "#fff");
  const textColor = useColorModeValue("#757a7d", "#757a7d");
  const logoColor = useColorModeValue(
    "/auth/sahulatpay-logo-light.svg",
    "/auth/sahulatpay-logo-light.svg"
  );
  const logoCollapse = useColorModeValue("/auth/logo.svg", "/auth/logo.svg")

  return (
    <>
      {/* Desktop Sidebar (xl+) */}
      {!isMobile && !shouldHideSidebar && (
        <Box
          position="fixed"
          left="0"
          top="0"
          h="100vh"
          w={sidebarWidth}
          bg={bg}
          color={textColor}
          shadow={"xs"}
          transition="width 0.3s ease-in-out"
          p={isExpanded ? 0 : 0}
          py={"4"}
          overflowY="auto"
          zIndex="10"
          className="no-scrollbar"
        >
          {/* Toggle Button & Logo (Desktop) */}
          <Box
            display={{ base: "none", xl: "flex" }}
            flexDir={isExpanded ? "row" : "column"}
            justifyContent={isExpanded ? "space-between" : "center"}
            alignItems={isExpanded ? "center" : "start"}
            gap={2}
            w="full"
            my="5"
            mb={isExpanded ? "8" : "5"}
            pl={isExpanded ? 5 : 4.5}
          >
            <Image src={isExpanded ? logoColor : logoCollapse} alt="logo" width={isExpanded ? 130 : 35} height={"50"} />

            <Tooltip
              content="Toggle Sidebar"
              positioning={{ offset: { mainAxis: 4, crossAxis: -6 }, placement: "right-end" }}
              openDelay={0}
              closeDelay={300}
              showArrow
            >
              <IconButton
                aria-label="Toggle Sidebar"
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
                color={textColor}
                transform={isExpanded ? "rotate(0deg)" : "rotate(180deg)"}
                transition="all 0.35s"
                zIndex="11"
              >
                <Icon as={LuSquareArrowLeft} boxSize={isExpanded ? 4 : 5} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Sidebar items */}
          <SidebarRoutes />
        </Box>
      )}
    </>
  );
};

export default Sidebar;
