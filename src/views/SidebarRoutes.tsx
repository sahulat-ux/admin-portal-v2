"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "@/context/SidebarProvider";
import { useColorModeValue } from "@/components/ui/color-mode";

import { VStack, Box, Icon, Text, Flex, chakra } from "@chakra-ui/react";

import { AnimatePresence, motion } from "framer-motion";

import { PiClockCountdownFill } from "react-icons/pi";
import {
  RiCurrencyFill,
  RiSecurePaymentLine,
  RiStackFill,
} from "react-icons/ri";
import {
  MdOutlineAppBlocking,
  MdOutlineLocalGroceryStore,
  MdOutlinePayments,
} from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import {
  LuArrowLeftRight,
  LuChartColumnStacked,
  LuFileSearch,
  LuFileText,
  LuLayoutGrid,
  LuStore,
} from "react-icons/lu";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BsCreditCard2Front } from "react-icons/bs";

interface SidebarRoutesProps {
  onClick?: () => void;
}

interface SidebarConfigItem {
  label: string;
  icon: React.ElementType;
  url: string;
  children?: SidebarChildItem[]; // optional
}

const SidebarRoutes = ({ onClick }: SidebarRoutesProps) => {
  const { isExpanded } = useSidebar();

  // State to track which item is open using Label of the item
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Define all sidebar items
  const userSidebarItems = [
    { label: "Dashboard", icon: LuLayoutGrid, url: "/", children: [] },
    {
      label: "Merchants",
      icon: LuStore,
      url: "/admin/merchants",
      children: [],
    },
    {
      label: "Ecommerce Merchants",
      icon: MdOutlineLocalGroceryStore,
      url: "#",
      children: [
        {
          label: "wooCommerce",
          icon: LuStore,
          url: "#",
        },
      ],
    },
    {
      label: "Transactions",
      icon: LuArrowLeftRight,
      url: "/admin/transactions",
    },
    {
      label: "Reports",
      icon: LuFileText,
      url: "/admin/reports",
      children: [],
    },
    {
      label: "Finance Reports",
      icon: LuChartColumnStacked,
      url: "#",
      children: [],
    },
    {
      label: "Disbursements",
      icon: RiStackFill,
      url: "#",
      children: [],
    },
    {
      label: "Disbursement Requests",
      icon: PiClockCountdownFill,
      url: "#",
      children: [],
    },
    {
      label: "Disbursement Dispute",
      icon: RiCurrencyFill,
      url: "#",
      children: [],
    },
    {
      label: "Status Inquiry",
      icon: LuFileSearch,
      url: "#",
      children: [],
    },
    {
      label: "Back Office",
      icon: HiOutlineOfficeBuilding,
      url: "#",
      children: [],
    },
    {
      label: "Initiate Payments",
      icon: FaMoneyBillTransfer,
      url: "#",
      children: [],
    },
    {
      label: "Block Number",
      icon: MdOutlineAppBlocking,
      url: "#",
      children: [],
    },
    {
      label: "Payment Gateway",
      icon: RiSecurePaymentLine,
      url: "#",
      children: [
        {
          label: "JazzCash",
          icon: MdOutlinePayments,
          url: "/gateway/jazz-cash",
        },
        {
          label: "EasyPaisa",
          icon: MdOutlinePayments,
          url: "/gateway/easypaisa",
        },
        {
          label: "Swich",
          icon: MdOutlinePayments,
          url: "/admin/gateway/swich",
        },
        {
          label: "Zindigi",
          icon: MdOutlinePayments,
          url: "/admin/gateway/zindigi",
        },
        {
          label: "PayFast",
          icon: MdOutlinePayments,
          url: "/admin/gateway/payfast",
        },
      ],
    },
    {
      label: "Disbursement Gateway",
      icon: MdOutlinePayments,
      url: "#",
      children: [
        {
          label: "JazzCash",
          icon: MdOutlinePayments,
          url: "/admin/disbursement/jazz-cash",
        },
        {
          label: "EasyPaisa",
          icon: MdOutlinePayments,
          url: "/admin/disbursement/easypaisa",
        },
      ],
    },
    {
      label: "Card Gateway",
      icon: BsCreditCard2Front,
      url: "#",
      children: [
        {
          label: "JazzCash",
          icon: MdOutlinePayments,
          url: "/admin/card-gateway/jazz-cash",
        },
      ],
    },
  ];

  const isChildItem = (
    item: SidebarChildItem,
    allItems: SidebarConfigItem[]
  ) => {
    return allItems.some(
      (parent) =>
        Array.isArray(parent.children) &&
        parent.children.some((child) => child.label === item.label)
    );
  };

  return (
    // Map all sidebar items
    <VStack align="flex-start" gap="1" px={3} h={"fit-content"}>
      {userSidebarItems.map((item) => {
        const isChild = isChildItem(item, userSidebarItems);

        return (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isExpanded={isExpanded}
            url={item.url}
            onClick={onClick}
            nestedItem={item.children}
            isOpen={openItem === item.label}
            setOpenItem={setOpenItem}
            isChild={isChild}
          />
        );
      })}
    </VStack>
  );
};

// Interface for the Items who have children or have nested routes
interface SidebarChildItem {
  label: string;
  icon: React.ElementType;
  url: string;
}

// Sidebaritem types
type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  isExpanded: boolean;
  url: string;
  onClick?: () => void;
  nestedItem?: SidebarChildItem[];
  isOpen: boolean;
  setOpenItem: React.Dispatch<React.SetStateAction<string | null>>;
  isChild?: boolean;
};

// SidebarItem component, which is used to render the sidebar items and nested items
export const SidebarItem = ({
  icon,
  label,
  isExpanded,
  url,
  onClick,
  nestedItem = [],
  isOpen,
  setOpenItem,
  isChild,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === url; // Check if the current path matches the item's URL
  const hasActiveChild = nestedItem?.some((item) => item.url === pathname); // Check if any child item is active

  const textColor = useColorModeValue("#03022980", "#03022980");
  const activeTextColor = useColorModeValue("#5B42F3", "#5B42F3");
  const bgHover = useColorModeValue("#5B42F3", "#5B42F3");

  const hasChildren = Array.isArray(nestedItem) && nestedItem.length > 0; // Check if the item has children

  // Motion component to animate the nested items
  const MotionDiv = motion.create(Flex);

  // Function to handle different click events
  const handleClick = () => {
    if (isChild) {
      setTimeout(() => {
        onClick?.();
      }, 800);
      return;
    }

    if (hasChildren) {
      // Toggle nested item open/close
      setOpenItem(isOpen ? null : label);
    } else {
      // Close any open nested menu
      setOpenItem(null);
      // Also close drawer
      setTimeout(() => {
        onClick?.();
      }, 800);
    }
  };

  return (
    <Box w={"100%"}>
      {!hasChildren ? (
        // Items which do not have children and are --Links--
        <Link href={url}>
          <Flex
            align="center"
            w={isExpanded ? "100%" : "fit"}
            ml={isExpanded ? "" : "3.5px"}
            color={isActive ? activeTextColor : textColor}
            _hover={{ color: !isActive ? bgHover : undefined }}
            cursor="pointer"
            bg={isActive ? "rgba(172, 169, 255, 0.25)" : ""}
            px={"2.5"}
            pr={isExpanded ? 0 : "2.5"}
            py={2}
            rounded={"lg"}
            onClick={handleClick}
          >
            <chakra.span display={"flex"} alignItems={"center"}>
              <Icon as={icon} boxSize="5" />
            </chakra.span>
            {isExpanded && (
              <Text
                ml="4"
                fontSize="16px"
                fontWeight={isActive ? "bold" : "normal"}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {label}
              </Text>
            )}
          </Flex>
        </Link>
      ) : (
        // Item which have children and are not --Links--
        <Flex
          align="center"
          w={isExpanded ? "100%" : "fit"}
          ml={isExpanded ? "" : "3.5px"}
          color={hasActiveChild ? activeTextColor : textColor}
          _hover={{ color: !isActive ? bgHover : undefined }}
          px={"2.5"}
          pr={isExpanded ? 0 : "2.5"}
          py={2}
          cursor="pointer"
          onClick={handleClick}
        >
          <chakra.span display={"flex"} alignItems={"center"}>
            <Icon as={icon} boxSize="5" />
          </chakra.span>
          {isExpanded && (
            <>
              <Text
                ml="4"
                fontSize="16px"
                fontWeight={hasActiveChild ? "bold" : "normal"}
                display={"flex"}
                alignItems={"center"}
                gap={1}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {label}
              </Text>

              <chakra.span
                rotate={!isOpen ? "0deg" : "-180deg"}
                mt={0.5}
                transition={"all 0.35s"}
                ml={"auto"}
              >
                <IoChevronDown />
              </chakra.span>
            </>
          )}
        </Flex>
      )}

      {/* Render nested children which are --Links--, only if expanded and open */}
      <AnimatePresence initial={false}>
        {isExpanded && isOpen && (
          <MotionDiv
            direction="column"
            gap="1"
            mt="1"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            overflow="hidden"
          >
            {(nestedItem ?? []).map((item) => (
              <Link href={item.url} key={item.label}>
                <Flex
                  align="center"
                  w="100%"
                  p={1}
                  pl={"3.5"}
                  rounded={"lg"}
                  color={pathname === item.url ? activeTextColor : textColor}
                  bg={pathname === item.url ? "rgba(172, 169, 255, 0.25)" : ""}
                  _hover={{ color: bgHover }}
                  cursor="pointer"
                  onClick={() => {
                    setTimeout(() => {
                      onClick?.();
                    }, 800);
                  }}
                >
                  <Icon as={item.icon} boxSize="3" />
                  {isExpanded && (
                    <Text
                      ml="5"
                      fontSize="14px"
                      fontWeight={pathname === item.url ? "bold" : "normal"}
                    >
                      {item.label}
                    </Text>
                  )}
                </Flex>
              </Link>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SidebarRoutes;
