import { useState, useEffect } from "react";
import { TableCell, Card, Box, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

import Icon from "../../../@core/components/icon";
import PaginatedTable, {
  ColumnsProps,
} from "../../../@core/components/PaginatedTable";
import WarningDialog from "../../../@core/components/warningDialog/WarningDialog";
import DialogEditMettings from "./EditMeetingDialog";

import {
  useDeleteMeetingMutation,
  useGetMeetingListQuery,
} from "../../../store/services";

import { handleReplaceDynVar } from "../../../lib/dynamicVariableReplacer";
import { ILead } from "../../../store/types/lead.types";
import MeetingFilters from "./MeetingFilters";
import MeetingHeader from "./MeetingHeader";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import useDebounce from "../../../hooks/useDebounce";
import { DateType } from "../../../@core/components/types/forms/reactDatepickerTypes";
import { useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";
export interface MeetingData {
  extraFields: any[];
  lead: ILead;
  leadEmail: string;
  teamName: string;
  leadOwner: string;
  meetingDate: string;
  meetingDuration: number;
  meetingSettings: {
    companyId: string;
    createdAt: string;
    fields: {};
    isDeleted: string;
    meetingBasicInfo: {
      meetingTitle: string;
      meetingSubTitle: {
        value: string;
        visible: boolean;
      };
      automaticTag: {};
    };
    meetingReminders: any[];
    showExtraFields: boolean;
    updatedAt: string;
    userId: string;
    __v: number;
    _id: string;
  };
  _id: string;
}

const MeetingTable = () => {
  const [teamName, setTeamName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [meetingId, setMeetingId] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState("");
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [startDateRange, setStartDateRange] = useState<DateType>(null);
  const [endDateRange, setEndDateRange] = useState<DateType>(null);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const debouncedSearchTerm = useDebounce(query, 500);

  const clientSettings = useSelector(
    (state: RootState) => state?.clientSetting?.ClientSetting
  );

  //filters
  const [meeting, setMeeting] = useState("");
  const {
    data = [],
    isLoading,
    error,
  } = useGetMeetingListQuery({
    offset: "",
    limit: "",
    searchQuery: debouncedSearchTerm.length >= 2 ? query : "",
    teamId: teamName,
    leadOwnerId: userName,
    meetingId: meeting,
    startDate: startDateRange,
    endDate: endDateRange,
  });

  const [handleDeleteMeeting, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteMeetingMutation();

  //@ts-ignore
  const meetingList: MeetingData[] = data?.data?.list;

  useEffect(() => {
    if (error) {
      enqueueSnackbar(<Translations text={"Error fetching data!"} />, {
        variant: "error",
      });
    }
    if (isDeleted) {
      setShowDialog(false);
      enqueueSnackbar(<Translations text={"Deleted Successfully!"} />, {
        variant: "success",
      });
    }
  }, [isDeleted, error]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatMeetingDate = (dateString: string): string => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });

    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const formatDetails = (details: any[]) => {
    const maxLength = 3;
    const values: string[] = [];
    details.slice(0, maxLength).forEach((data: any) => {
      Object.entries(data).forEach(([key, value]) => {
        if (value && key !== "_id") {
          values.push(value as string);
        }
      });
    });

    return values.join(", ");
  };

  const capitalizeName = (name: string) => {
    if (typeof name !== "string" || name.length === 0) {
      return name;
    }
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <MeetingFilters
        meeting={meeting}
        setMeeting={setMeeting}
        teamName={teamName}
        setTeamName={setTeamName}
        userName={userName}
        setUserName={setUserName}
        startDateRange={startDateRange}
        setStartDateRange={setStartDateRange}
        endDateRange={endDateRange}
        setEndDateRange={setEndDateRange}
      />
      <Card>
        <MeetingHeader setValue={setQuery} value={query} />

        <Card>
          <PaginatedTable
            id="name"
            hasCheckBox
            columns={headCells}
            items={meetingList}
            showPagination
            setSelected={setSelected}
            selected={selected}
            isLoading={isLoading}
            page={page}
            count={meetingList?.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[10, 50, 100]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            renderBody={(row: MeetingData, index) => {
              return (
                <>
                  <TableCell
                    key={row._id}
                    component="th"
                    scope="row"
                    width="200px"
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setShow(true);
                      setMeetingId(row?._id);
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {row.meetingSettings?.meetingBasicInfo?.meetingTitle && (
                        <Typography variant="subtitle2" color="text.primary">
                          {handleReplaceDynVar(
                            row?.lead,
                            row.meetingSettings?.meetingBasicInfo?.meetingTitle
                          )}
                        </Typography>
                      )}
                      {row.meetingSettings?.meetingBasicInfo
                        ?.meetingSubTitle && (
                        <Typography variant="caption" color="text.primary">
                          {handleReplaceDynVar(
                            row?.lead,
                            row.meetingSettings?.meetingBasicInfo
                              ?.meetingSubTitle?.value
                          )}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell width="200px" align="left">
                    {row?.meetingDate && clientSettings?.defaultDateTimeFormat
                      ? dayjs(row?.meetingDate).format(
                          clientSettings?.defaultDateTimeFormat
                        )
                      : formatMeetingDate(row?.meetingDate)}
                  </TableCell>
                  <TableCell width="200px" align="left">
                    {row?.lead?.address}
                  </TableCell>
                  <TableCell width="200px" align="left">
                    {handleReplaceDynVar(
                      row?.lead,
                      row.meetingSettings?.meetingBasicInfo?.meetingSubTitle
                        ?.value
                    )}
                  </TableCell>
                  <TableCell width="200px" align="center">
                    <Typography variant="subtitle2" color="text.primary">
                      {row?.leadOwner && capitalizeName(row?.leadOwner)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {row?.teamName && row?.teamName}
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell
                    align="left"
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setCurrentRowId(row._id);
                      setShowDialog(true);
                      setName(
                        handleReplaceDynVar(
                          row?.lead,
                          row?.meetingSettings?.meetingBasicInfo?.meetingTitle
                        )
                      );
                    }}
                  >
                    <Icon icon="mdi:rubbish-bin" />
                  </TableCell>
                </>
              );
            }}
          />

          <DialogEditMettings
            setShow={setShow}
            show={show}
            meetingId={meetingId}
          />
          {showDialog && (
            <WarningDialog
              content={t("Are you sure you want to delete meeting?")}
              isLoading={isDeleting}
              setShow={setShowDialog}
              onConfirm={() => {
                if (currentRowId) {
                  handleDeleteMeeting(currentRowId);
                }
              }}
              show={showDialog}
              name={name}
            />
          )}
        </Card>
      </Card>
    </>
  );
};
export default MeetingTable;

const headCells: ColumnsProps[] = [
  {
    id: "meeting",
    label: "MEETING",
  },
  {
    id: "date&time",
    label: "DATE & TIME",
  },
  {
    id: "address",
    label: "ADDRESS",
  },
  {
    id: "details",
    label: "DETAILS",
  },
  {
    id: "leadOwner",
    label: "LEAD OWNER",
    direction: "center",
  },
  {
    id: "",
    label: "",
  },
  {
    id: "",
    label: "",
  },
];
