"use client";

import React, { useState, useCallback } from "react";
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

interface SidebarChildItem {
  label: string;
  icon: React.ElementType;
  url: string;
}

interface SidebarConfigItem extends SidebarChildItem {
  children?: SidebarChildItem[]; // optional
}

interface SidebarRoutesProps {
  onClick?: () => void;
}

// Sidebar Items
const userSidebarItems: SidebarConfigItem[] = [
  { label: "Dashboard", icon: LuLayoutGrid, url: "/" },
  { label: "Merchants", icon: LuStore, url: "/admin/merchants" },
  {
    label: "Ecommerce Merchants",
    icon: MdOutlineLocalGroceryStore,
    url: "#",
    children: [{ label: "wooCommerce", icon: LuStore, url: "#" }],
  },
  { label: "Transactions", icon: LuArrowLeftRight, url: "/admin/transactions" },
  { label: "Reports", icon: LuFileText, url: "/admin/reports" },
  { label: "Finance Reports", icon: LuChartColumnStacked, url: "#" },
  { label: "Disbursements", icon: RiStackFill, url: "#" },
  { label: "Disbursement Requests", icon: PiClockCountdownFill, url: "#" },
  { label: "Disbursement Dispute", icon: RiCurrencyFill, url: "#" },
  { label: "Status Inquiry", icon: LuFileSearch, url: "#" },
  { label: "Back Office", icon: HiOutlineOfficeBuilding, url: "#" },
  { label: "Initiate Payments", icon: FaMoneyBillTransfer, url: "#" },
  { label: "Block Number", icon: MdOutlineAppBlocking, url: "#" },
  {
    label: "Payment Gateway",
    icon: RiSecurePaymentLine,
    url: "#",
    children: [
      { label: "JazzCash", icon: MdOutlinePayments, url: "/gateway/jazz-cash" },
      {
        label: "EasyPaisa",
        icon: MdOutlinePayments,
        url: "/gateway/easypaisa",
      },
      { label: "Swich", icon: MdOutlinePayments, url: "/admin/gateway/swich" },
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

const SidebarRoutes = ({ onClick }: SidebarRoutesProps) => {
  const { isExpanded } = useSidebar();
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Memoize the isChildItem function as it depends on a static array
  const isChildItem = useCallback(
    (item: SidebarChildItem) =>
      userSidebarItems.some(
        (parent) =>
          Array.isArray(parent.children) &&
          parent.children.some((child) => child.label === item.label)
      ),
    []
  );

  return (
    <VStack align="flex-start" gap="1" px={3} h={"fit-content"}>
      {userSidebarItems.map((item) => (
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
          isChild={isChildItem(item)}
        />
      ))}
    </VStack>
  );
};

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
  const isActive = pathname === url;
  const hasActiveChild = nestedItem?.some((item) => item.url === pathname);

  const textColor = useColorModeValue("#03022980", "#03022980");
  const activeTextColor = useColorModeValue("#5B42F3", "#5B42F3");
  const bgHover = useColorModeValue("#5B42F3", "#5B42F3");

  // Check if the item has children
  const hasChildren = !!nestedItem?.length;

  // Motion component to animate the nested items
  const MotionDiv = motion.create(Flex);

  // Function to handle different click events
  const handleClick = useCallback(() => {
    if (isChild) {
      setTimeout(onClick, 800);
      return;
    }

    if (hasChildren) {
      // Toggle nested item open/close
      setOpenItem((prevOpenItem) => (prevOpenItem === label ? null : label));
    } else {
      setOpenItem(null); // Close any open nested menu
      setTimeout(onClick, 800); // Also close drawer
    }
  }, [isChild, hasChildren, label, onClick, setOpenItem]);

  return (
    <Box w={"100%"}>
      {!hasChildren ? (
        // Items which do not have children and are --Links--
        <Link href={url} onClick={handleClick}>
          <Flex
            align="center"
            w={isExpanded ? "100%" : "fit"}
            ml={isExpanded ? "" : "3.5px"}
            color={isActive ? activeTextColor : textColor}
            _hover={{ color: !isActive ? bgHover : undefined }}
            cursor="pointer"
            bg={isActive ? "rgba(172, 169, 255, 0.25)" : ""}
            px={"2.5"}
            py={2}
            rounded={"lg"}
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
              <Link href={item.url} key={item.label} onClick={onClick}>
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
                >
                  <Icon as={item.icon} boxSize="3" opacity={0} />
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
