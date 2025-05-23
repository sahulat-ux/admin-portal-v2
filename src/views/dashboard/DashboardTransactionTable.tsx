"use client";

import {
  Box,
  Table,
  IconButton,
  Icon,
  Text,
  Flex,
  Skeleton,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";

import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useColorModeValue } from "@/components/ui/color-mode";
import { TypeDashboardTransformedPayload } from "@/utils/dashboardPayloadFormatter";

import {
  LuCircleCheckBig,
  LuClockAlert,
  LuTriangleAlert,
} from "react-icons/lu";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

export type TransformedTransaction = {
  transaction_id: string;
  merchant_transaction_id: string;
  date: string;
  amount: string;
  message: string;
  status: string;
  provider: string;
  type: string;
  account_no: string;
  settlement: boolean;
  callback_sent: boolean;
};

interface TransactionsTableProps {
  data: TypeDashboardTransformedPayload[];
  error: string | null;
  isLoading: boolean;
}

export const DashboardTransactionTable: React.FC<TransactionsTableProps> = ({
  data,
  error,
  isLoading,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableBg = useColorModeValue("white", "white");
  const textColor = useColorModeValue("#030229", "#030229");

  // Status-based colors (light/dark)
  const statBgColors = {
    pending: useColorModeValue("#F29339/12", "#F29339/12"),
    completed: useColorModeValue("#3A974C/12", "#3A974C/12"),
    failed: useColorModeValue("#D11A2A/12", "D11A2A/12"),
  };
  const statTextColors = {
    pending: useColorModeValue("#F29339", "#F29339"),
    completed: useColorModeValue("#3A974C", "#3A974C"),
    failed: useColorModeValue("#D11A2A", "D11A2A"),
  };

  // Pagination select options
  const pageSizeOptions = [5, 10, 20, 50].map((size) => ({
    label: `${size}`,
    value: size.toString(),
  }));
  const collection = createListCollection({ items: pageSizeOptions });

  // Table Columns & thier styles
  const columnHelper = createColumnHelper<TransformedTransaction>();
  const columns: ColumnDef<TransformedTransaction>[] = useMemo(
    () => [
      columnHelper.accessor("transaction_id", {
        header: "Transaction ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("merchant_transaction_id", {
        header: "Merchant Order ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => {
          const value = getValue().toLowerCase();

          let currentTextColor = textColor;
          let currentBgColor = "transparent";
          let currentIcon = null;

          if (value === "pending") {
            currentTextColor = statTextColors.pending;
            currentBgColor = statBgColors.pending;
            currentIcon = LuClockAlert;
          } else if (value === "failed") {
            currentTextColor = statTextColors.failed;
            currentBgColor = statBgColors.failed;
            currentIcon = LuTriangleAlert;
          } else if (value === "completed") {
            currentTextColor = statTextColors.completed;
            currentBgColor = statBgColors.completed;
            currentIcon = LuCircleCheckBig;
          }

          return (
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent={"center"}
              height="35px"
              width={"119px"}
              px={4}
              bg={currentBgColor}
              borderRadius="full"
            >
              {currentIcon && (
                <Box
                  as={currentIcon}
                  mr="1"
                  boxSize="3"
                  color={currentTextColor}
                />
              )}
              <Text color={currentTextColor} fontSize={"xs"}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Text>
            </Box>
          );
        },
      }),
      {
        accessorKey: "Account", // New accessor key for the combined column
        header: "Account",
        cell: ({ row }) => {
          // Use 'row' to access original data
          const providerValue = row.original.provider;
          const accountNoValue = row.original.account_no;

          let imageSource;
          // Determine image based on provider
          switch (providerValue) {
            case "JazzCash":
              imageSource = "/provider/jazz-cash.png";
              break;
            case "Easypaisa":
              imageSource = "/provider/easypaisa.png";
              break;
            case "CARD":
              imageSource = "/provider/card.png";
              break;
            case "ZINDIGI":
              imageSource = "/provider/zindigi.png";
              break;
            case "UPAISA":
              imageSource = "/provider/upaisa.png";
              break;
            default:
              imageSource = null;
          }

          return (
            <Flex align="center" alignItems={"center"} gap={"3"}>
              <Image
                src={imageSource}
                alt={providerValue}
                width={"30"}
                height={"30"}
              />
              <Text>{accountNoValue}</Text>{" "}
            </Flex>
          );
        },
      },
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => `Rs${info.getValue()}`,
        sortDescFirst: true,
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.accessor("callback_sent", {
        header: "Callback",
        cell: (info) => (info.getValue() ? "true" : "false"),
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("settlement", {
        header: "Settlement",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
      }),
      columnHelper.accessor("message", {
        header: "Message",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // State & ref to track the scroll of table container
  const scrollContainerRef = useRef(null);
  const [isScrolledY, setIsScrolledY] = useState(false);

  // useeffect to track the scroll of table container
  useEffect(() => {
    const scrollContainerElement = scrollContainerRef.current;
    if (scrollContainerElement) {
      const handleScroll = () => {
        if (scrollContainerElement.scrollTop > 5 && !isScrolledY) {
          setIsScrolledY(true);
        } else if (scrollContainerElement.scrollTop === 0 && isScrolledY) {
          setIsScrolledY(false); // Optional: Reset state if scrolled back to top
        }
      };

      scrollContainerElement.addEventListener('scroll', handleScroll);

      return () => {
        scrollContainerElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isScrolledY]); // Re-run effect if isScrolledY changes (optional reset)

  return (
    <Box
      rounded={"xl"}
    >
      <Box my={"4"} px={"4"}>
        <Text fontSize={"xl"} fontWeight={"medium"} color={"#030229"}>
          Latest Transactions
        </Text>
      </Box>

      <Table.ScrollArea
        rounded={"xl"}
        overflow={isLoading ? "hidden" : "auto"}
        className="custom-scrollbar"
        ref={scrollContainerRef}
        h={"420px"}
      >
        <Table.Root
          borderCollapse="separate"
          borderSpacing="0 10px"
          tableLayout="auto"
          stickyHeader
        >
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id} bg={isScrolledY ? "bg.emphasized" : "none"} transition={"all 0.3s"}>
                {headerGroup.headers.map((header, headerIndex) => {
                  return (
                    <Table.ColumnHeader
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      cursor={
                        header.column.getCanSort() ? "pointer" : "default"
                      }
                      py={isScrolledY ? "4" : "4"}
                      transition={"all 0.3s"}
                      px={4}
                      fontSize={"12px"}
                      fontWeight={"normal"}
                      opacity={"0.7"}
                      color={"#030229"}
                      borderWidth={"0px"}
                      borderRadius={
                        headerIndex === 0
                          ? "10px 0 0 10px"
                          : headerIndex === headerGroup.headers.length - 1
                          ? "0 10px 10px 0"
                          : "none"
                      }
                    >
                      <Flex align="center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <Icon
                            as={
                              header.column.getIsSorted() === "asc"
                                ? FaCaretUp
                                : header.column.getIsSorted() === "desc"
                                ? FaCaretDown
                                : FaCaretUp
                            }
                            boxSize={4}
                            ml={2}
                            opacity={header.column.getIsSorted() ? 1 : 0.3}
                          />
                        )}
                      </Flex>
                    </Table.ColumnHeader>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              // Skeleton when the data is Loading
              Array.from({ length: 10 }).map((_, index) => (
                <Table.Row key={index}>
                  {columns.map((_, colIndex) => (
                    <Table.Cell key={colIndex} py={2} px={4}>
                      <Skeleton
                        height="46px"
                        width={
                          colIndex <= 1
                            ? "210px"
                            : colIndex === 3
                            ? "200px"
                            : "140px"
                        }
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : error ? (
              // If error OR no data
              <Table.Row>
                <Table.Cell colSpan={columns.length} textAlign="center" py="6">
                  No Data Found
                </Table.Cell>
              </Table.Row>
            ) : (
              // Normal Data Rows
              table.getRowModel().rows.map((row) => (
                <Table.Row
                  key={row.id}
                  transition={"all 0.3s"}
                  _hover={{
                    filter: "drop-shadow(1px 17px 44px rgba(3, 2, 41, 0.08))",
                  }}
                  borderRadius={"12px"}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <Table.Cell
                      key={cell.id}
                      color={textColor}
                      bg={tableBg}
                      fontSize={"14px"}
                      fontWeight={"normal"}
                      py={"15px"}
                      px={4}
                      borderRadius={
                        cellIndex === 0
                          ? "10px 0 0 10px"
                          : cellIndex === row.getVisibleCells().length - 1
                          ? "0 10px 10px 0"
                          : "none"
                      }
                      borderBottomWidth={"0px"}
                    >
                      <Box
                        width={
                          cellIndex <= 1
                            ? "210px"
                            : cellIndex === 3
                            ? "200px"
                            : cellIndex === row.getVisibleCells().length - 1
                            ? "fit"
                            : "140px"
                        }
                        whiteSpace={
                          cellIndex === row.getVisibleCells().length - 1
                            ? "nowrap"
                            : "wrap"
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Box>
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Table Pagination & Items per page Controls */}
      {!isLoading && data && (
        <Flex
          flexDir={{ base: "column", sm: "row" }}
          justifyContent={"flex-end"}
          gap={2}
          my={4}
          align="center"
        >
          {/* Select box to select Number of items per page */}
          <Select.Root
            width="190px"
            value={[table.getState().pagination.pageSize.toString()]}
            onValueChange={(e) => table.setPageSize(Number(e.value))}
            collection={collection}
          >
            <Select.HiddenSelect />
            <Select.Control display={"flex"} alignItems={"center"} gap={2}>
              <Select.Label w={"150%"} color={textColor}>
                Items per page
              </Select.Label>
              <Select.Trigger cursor={"pointer"}>
                <Select.ValueText placeholder="Select page size" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>

            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {pageSizeOptions.map((item) => (
                    <Select.Item
                      item={item}
                      key={item.value}
                      cursor={"pointer"}
                    >
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          {/* Navigation buttons & Text */}
          <Flex align={"center"}>
            <Text fontSize="sm" color={textColor}>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </Text>

            <IconButton
              aria-label="Previous page"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="ghost"
            >
              <Icon
                as={IoChevronUpOutline}
                boxSize={4}
                transform="rotate(-90deg)"
              />
            </IconButton>
            <IconButton
              aria-label="Next page"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="ghost"
            >
              <Icon
                as={IoChevronDownOutline}
                boxSize={4}
                transform="rotate(270deg)"
              />
            </IconButton>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};
