"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "@/context/SidebarProvider";
import { useColorModeValue } from "@/components/ui/color-mode";

import { VStack, Box, Icon, Text, Flex, chakra } from "@chakra-ui/react";

import { AnimatePresence, motion } from "framer-motion";

import { GrTransaction } from "react-icons/gr";
import { PiClockCountdownFill } from "react-icons/pi";
import {
  RiCurrencyFill,
  RiHomeOfficeFill,
  RiSecurePaymentFill,
  RiStackFill,
  RiStore3Fill,
} from "react-icons/ri";
import { MdAppBlocking, MdOutlinePayments, MdPayments } from "react-icons/md";
import {
  FaCreditCard,
  FaMoneyBillTransfer,
  FaSquarePollVertical,
} from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { BiSolidFile, BiSolidFileFind } from "react-icons/bi";

interface SidebarRoutesProps {
  onClick?: () => void;
}

const SidebarRoutes = ({ onClick }: SidebarRoutesProps) => {
  const { isExpanded } = useSidebar();

  // State to track which item is open using Label of the item
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Define all sidebar items
  const userSidebarItems = [
    { label: "Dashboard", icon: GoHomeFill, url: "/admin", children: [] },
    {
      label: "Merchants",
      icon: RiStore3Fill,
      url: "/admin/merchants",
      children: [],
    },
    {
      label: "Transactions",
      icon: GrTransaction,
      url: "/admin/transactions",
    },
    {
      label: "Reports",
      icon: BiSolidFile,
      url: "/admin/reports",
      children: [],
    },
    {
      label: "Finance Reports",
      icon: FaSquarePollVertical,
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
      icon: BiSolidFileFind,
      url: "#",
      children: [],
    },
    { label: "Back Office", icon: RiHomeOfficeFill, url: "#", children: [] },
    {
      label: "Initiate Payments",
      icon: FaMoneyBillTransfer,
      url: "#",
      children: [],
    },
    {
      label: "Block Number",
      icon: MdAppBlocking,
      url: "#",
      children: [],
    },
    {
      label: "Payment Gateway",
      icon: RiSecurePaymentFill,
      url: "#",
      children: [
        {
          label: "JazzCash",
          icon: MdOutlinePayments,
          url: "/admin/gateway/jazz-cash",
        },
        {
          label: "EasyPaisa",
          icon: MdOutlinePayments,
          url: "/admin/gateway/easypaisa",
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
      icon: MdPayments,
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
      icon: FaCreditCard,
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

  return (
    // Map all sidebar items
    <VStack align="flex-start" gap="1" h={"fit-content"}>
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
        />
      ))}
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
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === url; // Check if the current path matches the item's URL
  const hasActiveChild = nestedItem?.some((item) => item.url === pathname); // Check if any child item is active

  const textColor = useColorModeValue("#030229", "white");
  const activeTextColor = useColorModeValue("#605BFF", "#605BFF");
  const bgHover = useColorModeValue("#605BFF", "#605BFF");

  const isActiveBg = useColorModeValue(
    `linear-gradient(to right, rgba(172, 169, 255, 0.4) , rgba(172, 169, 255, 0))`,
    `linear-gradient(to right, rgba(172, 169, 255, 0.5) 2%, rgba(172, 169, 255, 0.1) 20%, rgba(127, 127, 213, 0) 100%)`
  );

  const hasChildren = Array.isArray(nestedItem) && nestedItem.length > 0; // Check if the item has children

  // Motion component to animate the nested items
  const MotionDiv = motion.create(Flex);

  // Function to handle different click events
  const handleClick = () => {
    if (nestedItem && nestedItem.length > 0) {
      // Toggle nested item open/close
      setOpenItem(isOpen ? null : label);
    } else if (nestedItem && nestedItem.length === 0) {
      // Close any open nested menu
      setOpenItem(null);
      // Also close drawer
      setTimeout(() => {
        onClick?.();
      }, 800);
    } else {
      // Also close drawer
      setTimeout(() => {
        onClick?.();
      }, 800);
    }
  };

  return (
    <Box onClick={handleClick}>
      {!hasChildren ? (
        // Items which do not have children and are --Links--
        <Link href={url}>
          <Flex
            align="center"
            justify={isExpanded ? "start" : "center"}
            w="100%"
            color={isActive ? activeTextColor : textColor}
            opacity={isActive ? 1 : 0.5}
            _hover={{ color: !isActive ? bgHover : undefined, opacity: 1 }}
            cursor="pointer"
            onClick={handleClick}
          >
            <chakra.span
              bgGradient={isActive ? isActiveBg : ""}
              pl={isExpanded ? "3" : "6"}
              py={2}
            >
              <Icon as={icon} boxSize="5" />
            </chakra.span>
            {isExpanded && (
              <Text
                ml="4"
                fontSize="13px"
                fontWeight={isActive ? "bold" : "normal"}
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
          w="100%"
          color={hasActiveChild ? activeTextColor : textColor}
          opacity={hasActiveChild ? 1 : 0.5}
          _hover={{ color: !isActive ? bgHover : undefined, opacity: 1 }}
          cursor="pointer"
          onClick={handleClick}
        >
          <chakra.span
              bgGradient={hasActiveChild ? isActiveBg : ""}
              pl={isExpanded ? "3" : "6"}
              py={2}
            >
              <Icon as={icon} boxSize="5" />
            </chakra.span>
          {isExpanded && (
            <Text
              ml="4"
              fontSize="13px"
              fontWeight={isActive ? "bold" : "normal"}
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              {label}
              <chakra.span
                rotate={!isOpen ? "-90deg" : "0deg"}
                mt={0.5}
                transition={"all 0.35s"}
              >
                <IoChevronDown />
              </chakra.span>
            </Text>
          )}
        </Flex>
      )}

      {/* Render nested children which are --Links--, only if expanded and open */}
      <AnimatePresence initial={false}>
        {isExpanded && isOpen && hasChildren && (
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
                  pl={isExpanded ? "5" : "2"}
                  fontSize="10px"
                  color={pathname === item.url ? activeTextColor : textColor}
                  opacity={pathname === item.url ? 1 : 0.5}
                  _hover={{ color: bgHover, opacity: 1 }}
                  fontWeight={pathname === item.url ? "bold" : "normal"}
                  cursor="pointer"
                  onClick={onClick}
                >
                  <Icon as={item.icon} boxSize="3" />
                  {isExpanded && (
                    <Text
                      ml="4"
                      fontSize="11px"
                      fontWeight={isActive ? "bold" : "normal"}
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
