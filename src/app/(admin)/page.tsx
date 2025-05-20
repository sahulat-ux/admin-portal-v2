"use client";

import UserBalanceCard from "@/components/cards/UserBalanceCard";
import useFetchAdminDashboardData from "@/hooks/useFetchAdminDashboardData";
import { handleDateRangeSelection } from "@/utils/dateRangeSelector";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Menu,
  Portal,
  useDialog,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { BiCollection, BiDollar, BiSolidCollection } from "react-icons/bi";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import { SiOpencollective } from "react-icons/si";

function Page() {
  const { data, allData, error, isLoading, fetchData } = useFetchAdminDashboardData();

  // Destructure todayIncome and other fields from allData for use in the component
  const {
    totalMerchants,
    totalIncome,
    todayIncome,
    totalBalanceToDisburse,
    totalDisbursmentAmount,
    totalSettlementBalance,
    totalSettlementAmount,
    totalUsdtSettlement,
    remainingSettlements,
    totalRefund,
  } = allData || {};

  // Sates for date filtering
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<{
    start: string;
    end: string;
  }>(() => handleDateRangeSelection("All Time"));
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const dialog = useDialog();

  // Determine the current date option, then filter it out
  const dateOptions = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
    "All Time",
    "Custom Date",
  ];

  const currentDate =
    dateFilter && dateFilter !== ""
      ? dateOptions.find((d) => d === dateFilter)
      : "Filter By Date";

  const filteredDateOptions = dateOptions.filter(
    (date) => date !== currentDate
  );

  // Apply custom date selection: set start to beginning of day and end to end of day
  const applyCustomDate = () => {
    if (customStartDate && customEndDate) {
      const customRange = {
        start: moment(customStartDate).startOf("day").format(),
        end: moment(customEndDate).endOf("day").format(),
      };
      setSelectedRange(customRange);
      setDateFilter("Custom Date");
      dialog.setOpen(false);
      // Reset custom date values if needed
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  // Fetch dashboard data when selectedRange changes
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (selectedRange !== undefined) {
      fetchData(selectedRange, signal);
    }

    return () => {
      controller.abort();
    };
  }, [selectedRange, fetchData]);

  return (
    <Box p={6} display={"flex"} flexDir={"column"} gap={6}>
      <HStack align={"center"} justify={"space-between"}>
        <Heading fontSize={"2xl"}>Dashboard</Heading>

        {/* Date filter Menu */}
        <Box>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant={"surface"} focusRing={"none"} rounded={"md"}>
                {currentDate}
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {filteredDateOptions
                    .filter((range) => range !== "Custom Date") // don't show in map
                    .map((range) => (
                      <Menu.Item
                        key={range}
                        value={range}
                        onClick={() => {
                          if (range === "All Time") {
                            setDateFilter(range);
                            setSelectedRange({ start: "", end: "" });
                          } else {
                            setDateFilter(range);
                            const selected = handleDateRangeSelection(range);
                            setSelectedRange(selected);
                          }
                        }}
                      >
                        {range}
                      </Menu.Item>
                    ))}
                  {/* Show Custom Date only if not already selected */}
                  {dateFilter !== "Custom Date" && (
                    <Menu.Item
                      value="Custom Date"
                      onClick={() => dialog.setOpen(true)}
                    >
                      Custom Date
                    </Menu.Item>
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>

        {/* Custom Date Dialog Box */}
        <Dialog.RootProvider value={dialog}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.CloseTrigger />
              <Dialog.Header>
                <Dialog.Title>Custom Date</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  placeholder="Start Date"
                  mb={4}
                />
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  placeholder="End Date"
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" rounded={"md"}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>

                <Button
                  bgGradient="linear-gradient(to right, #5B42F3, #8C6FF0)"
                  rounded={"md"}
                  transition={"all 0.25s"}
                  _hover={{ opacity: 0.8 }}
                  onClick={applyCustomDate}
                >
                  Apply
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.RootProvider>
      </HStack>

      <Grid
        gridTemplateColumns={{
          base: "1fr",
          sm: "1fr 1fr",
          lg: "1fr 1fr 1fr",
          "2xl": "repeat(4, 1fr)",
        }}
        gap={{ base: "4", md: "6" }}
      >
        <GridItem>
          <UserBalanceCard
            title="Today Collection"
            amount={todayIncome}
            icon={BiCollection}
            bgCard="white"
            colorIcon="#605BFF"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Collection"
            amount={totalIncome}
            icon={BiCollection}
            bgCard="white"
            colorIcon="#B85EFF"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Balance to Disbursement"
            amount={totalBalanceToDisburse}
            icon={BiCollection}
            bgCard="white"
            colorIcon="#FF8F6B"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Disbursement Amount"
            amount={totalDisbursmentAmount}
            icon={BiCollection}
            bgCard="white"
            colorIcon="#FF6A77"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Available Balance"
            amount={totalSettlementBalance}
            icon={BiSolidCollection}
            bgCard="white"
            colorIcon="#FF8F6B"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Settlement Amount"
            amount={totalSettlementAmount}
            icon={SiOpencollective}
            bgCard="white"
            colorIcon="#26C0E2"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="USDT Settlement"
            amount={totalUsdtSettlement}
            icon={BiDollar}
            bgCard="white"
            colorIcon="#00C4B4"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Remaining Settlement"
            amount={remainingSettlements}
            icon={BiCollection}
            bgCard="white"
            colorIcon="#3B8CFF"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total Refund"
            amount={totalRefund}
            icon={RiRefund2Line}
            bgCard="white"
            colorIcon="#FFC327"
            isLoading={isLoading}
          />
        </GridItem>

        <GridItem>
          <UserBalanceCard
            title="Total User"
            amount={totalMerchants}
            icon={MdOutlinePeopleAlt}
            bgCard="white"
            colorIcon="#FFA726"
            isLoading={isLoading}
          />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Page;
