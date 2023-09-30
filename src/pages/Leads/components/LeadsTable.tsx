import { useState, useEffect, useCallback } from "react";
import {
  TableCell,
  Card,
  Typography,
  Menu,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import Icon from "../../../@core/components/icon";
import PaginatedTable, {
  ColumnsProps,
  Order,
} from "../../../@core/components/PaginatedTable";
import {
  useDeleteLeadMutation,
  useGetCompanyDetailsByIdQuery,
  useGetLeadListQuery,
  useGetTagsAndStatusesQuery,
} from "../../../store/services";
import WarningDialog from "../../../@core/components/warningDialog/WarningDialog";
import { useSnackbar } from "notistack";
import { ILead } from "../../../store/types/lead.types";
import { ITagsAndStatuses } from "../../../store/types/tagsAndStatuses.types";
import DialogAddLead from "../../../@core/components/AddLead/DialogAddLead";
import { useNavigate } from "react-router";
import APP_ROUTES from "../../../Routes/routes";
import LeadsFilters from "./LeadsFilters";
import LeadsHeader from "./LeadsHeader";
import useDebounce from "../../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { handleReplaceDynVar } from "../../../lib/dynamicVariableReplacer";
import { DateType } from "../../../@core/components/types/forms/reactDatepickerTypes";
import Translations from "../../../@core/layouts/Translations";
import { INITAIAL_STAGES } from "../../TagsAndStatuses";
export const handleCurrentStatus = (
  stages: ITagsAndStatuses[],
  leadStageId?: string
) => {
  const updatedStags = stages?.length ? stages : INITAIAL_STAGES;
  const seletedStage: ITagsAndStatuses | undefined = updatedStags?.find(
    (stage: ITagsAndStatuses) => stage.id === leadStageId
  );
  return (
    seletedStage || INITAIAL_STAGES.find((stage) => stage.id === "notConnected")
  );
};

const LeadsTable = () => {
  const [offSet, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<string>("createdAt");
  const [selected, setSelected] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [show, setShow] = useState<boolean>(false);
  const [currentUserData, setCurrentData] = useState<ILead | null>();
  const [name, setName] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState("");
  const [query, setQuery] = useState("");

  //filters
  const [teamName, setTeamName] = useState("");
  const [leadOwner, setLeadOwner] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [startDateRange, setStartDateRange] = useState<DateType>(null);
  const [endDateRange, setEndDateRange] = useState<DateType>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const clientId = useSelector(
    (state: RootState) => state.auth.user?.companyId
  );
  const debouncedSearchTerm = useDebounce(query, 500);

  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useGetLeadListQuery({
    limit,
    offset: pageOffSet,
    searchQuery: debouncedSearchTerm?.length >= 2 ? query : "",
    order: order === "asc" ? 1 : -1,
    sort: orderBy,
    teamId: teamName,
    leadOwnerId: leadOwner,
    tag: tags,
    sid: stage,
    startDate: startDateRange ? startDateRange.toString() : null,
    endDate: endDateRange ? endDateRange.toString() : null,
  });

  const { data: stagesTagsData } = useGetTagsAndStatusesQuery(clientId);

  const [
    handleDeleteLead,
    { isLoading: isDeleting, isSuccess: isDeleted, error },
  ] = useDeleteLeadMutation();

  const { data: companySetting } = useGetCompanyDetailsByIdQuery(clientId);

  //@ts-ignore
  const leadList: ILead[] = data?.data?.list;
  //@ts-ignore
  const totalCount = data?.data?.totalCount;
  //@ts-ignore
  const stages = stagesTagsData?.data?.stages;
  //@ts-ignore
  const clientSettings = companySetting?.data;

  const dateFormat = useSelector(
    (state: RootState) =>
      state?.clientSetting?.ClientSetting?.defaultDateTimeFormat
  );
  const meetingDetails = useSelector(
    (state: RootState) => state?.leadMeeting?.meeting
  );

  const handleGetNextMeetingScheduleTime = (lead: ILead) => {
    const parseDate = (date: string) => new Date(date);
    const validDate = (date: Date) => !isNaN(date.getTime());

    const meetingDate = lead?.meetingDate;
    const scheduledCallDateTime =
      lead?.scheduleCallDetails?.scheduledCallDateTime;

    if (!meetingDate && !scheduledCallDateTime) return null;

    const meetingDateTime = parseDate(meetingDate);
    const callDateTime = parseDate(scheduledCallDateTime);

    if (!validDate(meetingDateTime) && !validDate(callDateTime))
      throw new Error("Invalid date format");

    const isMeeting =
      validDate(meetingDateTime) && validDate(callDateTime)
        ? meetingDateTime > callDateTime
        : validDate(meetingDateTime);
    const time = isMeeting ? meetingDateTime : callDateTime;

    return { isMeeting, time };
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    setOffset(0);
    setPageOffSet(0);
  }, [order]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(<Translations text="Error fetching data!" />, {
        variant: "error",
      });
    }
    if (isDeleted) {
      setShowDialog(false);
      enqueueSnackbar(<Translations text="Deleted Successfully!" />, {
        variant: "success",
      });
    }
  }, [isDeleted]);

  const handleChangePage = (event: unknown, newPage: number) => {
    const add = newPage > offSet;
    if (add) {
      setPageOffSet(limit * newPage);
    } else {
      setPageOffSet(pageOffSet - limit);
    }
    setOffset(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };
  console.log('leadList', leadList)
  return (
    <>
      <LeadsFilters
        teamName={teamName}
        setTeamName={setTeamName}
        setLeadOwner={setLeadOwner}
        leadOwner={leadOwner}
        setStage={setStage}
        stage={stage}
        setTags={setTags}
        tags={tags}
        startDateRange={startDateRange}
        setStartDateRange={setStartDateRange}
        endDateRange={endDateRange}
        setEndDateRange={setEndDateRange}
      />
      <Card>
        <LeadsHeader setValue={setQuery} value={query} selected={selected} />
        <PaginatedTable
          id="name"
          hasCheckBox
          columns={headCells}
          items={leadList}
          showPagination
          setSelected={setSelected}
          selected={selected}
          isLoading={isLoading}
          page={offSet}
          count={totalCount}
          rowsPerPage={limit}
          setOrder={setOrder}
          order={order}
          setOrderBy={setOrderBy}
          orderBy={orderBy}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          renderBody={(row: ILead, index) => {
            const notes = row?.leadExtraInfo?.filter(
              (e) => e?.metaKey === "NOTES"
            );
            const nextCall = handleGetNextMeetingScheduleTime(row);
            const stage = handleCurrentStatus(
              stages,
              row.leadStageId
            ) as ITagsAndStatuses;
            return (
              <>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ cursor: "pointer", width: 130 }}
                  onClick={() =>
                    navigate(`${APP_ROUTES.leadsDetails}/${row._id}`)
                  }
                >
                  <Typography variant="subtitle2" color="text.primary">
                    {handleReplaceDynVar(row, clientSettings?.leadTitle)}
                  </Typography>
                  <Typography variant="caption" color="text.primary">
                    {handleReplaceDynVar(row, clientSettings?.leadSubTitle)}
                  </Typography>
                </TableCell>
                <TableCell align="left" width={380}>
                  <Box>
                    {/* <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    > */}
                    <Button
                      variant="contained"
                      sx={{
                        background: stage?.backgroundColor,
                        // height: "30px",
                        // width: "-webkit-fill-available",
                        // width: "70%",
                      }}
                    >
                      <Translations text={stage?.statusName} />
                      {/* {stage?.statusName} */}
                    </Button>

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {nextCall?.time && (
                        <Typography variant="subtitle2" color="text.primary">
                          {nextCall?.isMeeting
                            ? handleReplaceDynVar(
                              meetingDetails?.leadId,
                              meetingDetails?.meetingId?.meetingBasicInfo
                                ?.meetingTitle || "Meeting"
                            ) + " "
                            : "Next Call "}
                          {nextCall?.time && dateFormat
                            ? dayjs(nextCall?.time).format(dateFormat)
                            : dayjs(nextCall?.time).format("MMM DDo h.mm")}
                        </Typography>
                      )}
                      {stage?.id === "connected" ? (
                        <Typography variant="caption" color="text.primary">
                          {row.address}
                        </Typography>
                      ) : (
                        <>
                          <Typography variant="caption" color="text.primary">
                            {row?.callAttemptedByUsers?.filter((attempt) => attempt.callLead)?.length
                              ? ` Called x${row?.callAttemptedByUsers?.filter((attempt) => attempt.callLead)?.length}`
                              : "No Calls"}
                          </Typography>
                        </>
                      )}
                    </Box>
                    {/* </Box> */}
                  </Box>
                </TableCell>
                <TableCell align="left" width={230}>
                  <Typography variant="subtitle2" color="text.primary">
                    {handleReplaceDynVar(row, clientSettings?.detailsTitle)}
                  </Typography>
                  <Typography variant="caption" color="text.primary">
                    {handleReplaceDynVar(row, clientSettings?.detailsSubTitle)}
                  </Typography>
                </TableCell>
                <TableCell align="left" width={150}>
                  <Typography variant="subtitle2" color="text.primary">
                    {row.leadOwnerName}
                  </Typography>
                </TableCell>
                <TableCell width={200}>
                  <Typography variant="body2" color="text.primary">
                    {notes[notes?.length - 1]?.metaValue?.text}
                  </Typography>
                </TableCell>
                <TableCell align="center" width={80}>
                  <Icon
                    icon="entypo:dots-three-vertical"
                    color="#3A35418A"
                    width="16px"
                    style={{ cursor: "pointer" }}
                    //@ts-ignore
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                      setAnchorEl(event.currentTarget);
                      setCurrentRowId(row._id);
                    }}
                  />
                  <Menu
                    id="dot-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && currentRowId === row._id}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem
                      onClick={() => {
                        setShow(true);
                        setCurrentData(row);
                        setAnchorEl(null);
                      }}
                    >
                      <Translations text="Edit Lead" />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setCurrentRowId(row._id);
                        setShowDialog(true);
                        setAnchorEl(null);
                        setName(row?.firstName + " " + row?.lastName);
                      }}
                    >
                      <Translations text="Delete" />
                    </MenuItem>
                  </Menu>
                </TableCell>
              </>
            );
          }}
        />

        <DialogAddLead
          setShow={setShow}
          show={show}
          leadId={currentUserData?._id}
        />

        {showDialog && (
          <WarningDialog
            content="Are you sure you want to delete Lead?"
            isLoading={isDeleting}
            setShow={setShowDialog}
            onConfirm={() => {
              if (currentRowId) {
                handleDeleteLead(currentRowId);
              }
            }}
            show={showDialog}
            name={name}
          />
        )}
      </Card>
    </>
  );
};
export default LeadsTable;

const headCells: ColumnsProps[] = [
  {
    id: "lead",
    label: "LEAD",
    hideSortIcon: true,
  },
  {
    id: "status",
    label: "STATUS",
  },
  {
    id: "details",
    label: "DETAILS",
    hideSortIcon: true,
  },
  {
    id: "lead owner",
    label: "LEAD OWNER",
  },
  {
    id: "note",
    label: "NOTE",
    hideSortIcon: true,
  },
  {
    id: "",
    label: "",
    hideSortIcon: true,
  },
];
