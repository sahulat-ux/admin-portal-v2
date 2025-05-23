"use client";

import { getMerchants } from "@/utils/apisHandler";
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Icon,
  Text,
  Flex,
  Skeleton,
} from "@chakra-ui/react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";  
import { Menu, Portal, IconButton } from "@chakra-ui/react"
import { FiMoreHorizontal } from "react-icons/fi"
import { FaPencilAlt, FaTrash } from "react-icons/fa"


// 1️⃣ Define Merchant type
type Merchant = {
  uid: string;
  merchant_id: number;
  full_name: string;
  company_name: string;
  phone_number: string;
  city: string | null;
  payment_volume: string;
  balanceToDisburse: string;
  commissions: any[];
  createdAt: string;
};

  const handleEdit = (merchant: Merchant) => {
    // e.g. push to an edit page, open a modal, etc.
    console.log("Edit merchant", merchant);
  };

  const handleDelete = (merchant: Merchant) => {
    // e.g. open a confirmation dialog, call your delete API, refresh table…
    console.log("Delete merchant", merchant);
  };


// 2️⃣ Column definitions
const columnHelper = createColumnHelper<Merchant>();
const columns: ColumnDef<Merchant>[] = [
  columnHelper.accessor("uid", {
    header: "ID",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("company_name", {
    header: "Company",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("full_name", {
    header: "Merchant Name",
    cell: info => info.getValue(),
  }),
  // inside your ColumnDef<Merchant>[]
{
  id: "actions",
  // header: "Actions",
  cell: ({ row }) => {
    const merchant = row.original;

    return (
      <Menu.Root
        onSelect={(detail) => {
          if (detail.value === "edit") {
            handleEdit(merchant);
          }
          if (detail.value === "delete") {
            handleDelete(merchant);
          }
        }}
      >
        {/* trigger button */}
        <Menu.Trigger asChild>
          <IconButton
            aria-label="Open actions menu"
            
            variant="ghost"
            size="sm"
          ><FiMoreHorizontal /></IconButton>
        </Menu.Trigger>

        {/* portal + positioning */}
        <Portal>
          <Menu.Positioner>
            <Menu.Content
              p={0}
              borderRadius="12px"
              boxShadow="md"
              overflow="hidden"
            >
              {/* Edit */}
              <Menu.Item
                value="edit"
                _hover={{ bg: "blue.50" }}
              >
                <Flex align="center">
                  <FaPencilAlt />
                  <Text ml={2}>Edit</Text>
                </Flex>
              </Menu.Item>

              {/* Delete */}
              <Menu.Item
                value="delete"
                _hover={{ bg: "red.50" }}
                color="red.600"
              >
                <Flex align="center">
                  <FaTrash />
                  <Text ml={2}>Delete</Text>
                </Flex>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    );
  },
  enableSorting: false,
  size: 50,
},

];

const MerchantsPage = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: merchants,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getMerchants();
        console.log("🛒 fetched merchants:", data);
        setMerchants(data.data || []);
      } catch (err) {
        console.error("❌ error loading merchants:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const handleEdit = (merchant: Merchant) => {
    // e.g. push to an edit page, open a modal, etc.
    console.log("Edit merchant", merchant);
  };

  const handleDelete = (merchant: Merchant) => {
    // e.g. open a confirmation dialog, call your delete API, refresh table…
    console.log("Delete merchant", merchant);
  };
  

  if (loading) return <p>Loading merchants…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <Box rounded={"xl"} p={6}>
      <Box my={"4"} px={"4"}>
        <Text fontSize={"xl"} fontWeight={"medium"} color={"#030229"}>
          Latest Transactions
        </Text>
      </Box>

      <Table.ScrollArea
        rounded={"xl"}
        overflow={loading ? "hidden" : "auto"}
        className="custom-scrollbar"
        h={"420px"}
      >
        <Table.Root
          borderCollapse="separate"
          borderSpacing="0 10px"
          tableLayout="auto"
          stickyHeader
        >
          {/* Header */}
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id} bg={"none"} transition={"all 0.3s"}>
                {headerGroup.headers.map((header, headerIndex) => (
                  <Table.ColumnHeader
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    cursor={
                      header.column.getCanSort() ? "pointer" : "default"
                    }
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
                        // ◀︎ Here’s the single child Icon fix ▶︎
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
                ))}
              </Table.Row>
            ))}
          </Table.Header>

          {/* Body */}
          <Table.Body>
            {loading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <Table.Row key={idx}>
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
            ) : merchants.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={columns.length} textAlign="center" py="6">
                  No Data Found
                </Table.Cell>
              </Table.Row>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Row
                  key={row.id}
                  transition={"all 0.3s"}
                  _hover={{
                    filter:
                      "drop-shadow(1px 17px 44px rgba(3, 2, 41, 0.08))",
                  }}
                  borderRadius={"12px"}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <Table.Cell
                      key={cell.id}
                      fontSize={"14px"}
                      fontWeight={"normal"}
                      py={"15px"}
                      px={4}
                      borderRadius={
                        cellIndex === 0
                          ? "10px 0 0 10px"
                          : cellIndex ===
                            row.getVisibleCells().length - 1
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
                            : cellIndex ===
                              row.getVisibleCells().length - 1
                            ? "fit"
                            : "140px"
                        }
                        whiteSpace={
                          cellIndex ===
                          row.getVisibleCells().length - 1
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
    </Box>
  );
};

export default MerchantsPage;
