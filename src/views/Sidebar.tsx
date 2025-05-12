"use client";

import Image from "next/image";

import { useColorModeValue } from "@/components/ui/color-mode";
import { useSidebar } from "@/context/SidebarProvider";

import { IconButton, useBreakpointValue, Box, Icon } from "@chakra-ui/react";
import { VscLayoutSidebarLeft, VscLayoutSidebarLeftOff } from "react-icons/vsc";

import SidebarRoutes from "./SidebarRoutes";
import { Tooltip } from "@/components/ui/tooltip";

const Sidebar = () => {

  const { isExpanded, toggleSidebar } = useSidebar();
  const isMobile = useBreakpointValue({ base: true, xl: false }); // Check if the screen size is mobile

  // For Desktop
  const sidebarWidth = useBreakpointValue({
    base: "0px",
    xl: isExpanded ? "220px" : "73px",
  });

  const bg = useColorModeValue("#fff", "#08070d");
  const color = useColorModeValue("#757a7d", "white");
  const logoColor = useColorModeValue(
    "/sahulatpay-logo-light.png",
    "/sahulatpay-logo-dark.png"
  );
  const sidebarborderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <>
      {/* Desktop Sidebar (xl+) */}
      {!isMobile && (
        <Box
          position="fixed"
          left="0"
          top="0"
          h="100vh"
          w={sidebarWidth}
          bg={bg}
          color={color}
          borderRightWidth={"1px"}
          borderColor={sidebarborderColor}
          transition="width 0.35s ease-in-out"
          p={isExpanded ? 0 : 0}
          py={"4"}
          overflowY="auto"
          zIndex="10"
        >
          {/* Toggle Button (Desktop) */}
          <Box
            display={{ base: "none", xl: "flex" }}
            flexDir={isExpanded ? "row" : "column"}
            justifyContent={isExpanded ? "space-between" : "center"}
            alignItems="center"
            gap={2}
            w="full"
            mb="6"
            mt={isExpanded ? "0" : "4"}
            px={2}
          >
            <Image src={logoColor} alt="logo" width={"135"} height={"50"} />

            <Tooltip
              content="Toggle Sidebar"
              // positioning={{ placement: "right-end" }}
              positioning={{ offset: { mainAxis: 4, crossAxis: -10 }, placement: "right-end" }}
              openDelay={0}
              closeDelay={300}
              showArrow
            >
              <IconButton
                aria-label="Toggle Sidebar"
                onClick={toggleSidebar}
                variant="ghost"
                size="lg"
                color={color}
                // transform={isExpanded ? "rotate(0deg)" : "rotate(180deg)"}
                mr={isExpanded ? "0" : "1"}
                transition="all 0.35s"
                zIndex="11"
              >
                {/* <Icon as={TbLayoutSidebarLeftExpand} boxSize={6} /> */}
                <Icon
                  as={
                    isExpanded ? VscLayoutSidebarLeftOff : VscLayoutSidebarLeft
                  }
                  boxSize={6}
                />
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
