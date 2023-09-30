import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Card, Typography } from "@mui/material";
import Icon from "../../../@core/components/icon/index";
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
} from "../../../store/services/index";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { ILead } from "../../../store/types/lead.types";
import dayjs from "dayjs";
import WarningDialog from "../../../@core/components/warningDialog/WarningDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Translation, useTranslation } from "react-i18next";
import Translations from "../../../@core/layouts/Translations";

export interface INote {
  _id: string;
  leadId: string;
  metaKey: string;
  metaValue: {
    text: string;
    leadName: string;
    timestamp: string;
  };
}
interface IProps {
  leadDetails: ILead;
}

function NotesComponent({ leadDetails }: IProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [newNote, setNewNote] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [noteId, setNoteId] = useState("");
  const { leadId } = useParams();
  const [handleAddNote, { isSuccess, error }] = useAddNoteMutation();
  const [deleteNote, { isSuccess: isDeleted, isLoading: isDeleting }] =
    useDeleteNoteMutation();

  const currentUser = useSelector(
    (state: RootState) => state?.currentUser?.currentUser
  );

  const { t } = useTranslation();

  const notes = leadDetails?.leadExtraInfo as INote[];

  const handleSubmit = () => {
    if (newNote.trim() !== "" && leadId) {
      //@ts-ignore
      const newNoteObj: INote = {
        leadId: leadId,
        metaKey: "NOTES",
        metaValue: {
          text: newNote.trim(),
          timestamp: new Date().toLocaleString(),
          leadName: currentUser?.firstName + " " + currentUser?.lastName,
        },
      };
      handleAddNote(newNoteObj);
      setNewNote("");
    }
  };

  useEffect(() => {
    if (isDeleted) {
      enqueueSnackbar(<Translations text="Note deleted successfully." />, {
        variant: "success",
      });
      setShowDialog(false);
    }
  }, [isDeleted]);

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar(<Translations text="Note added successfully." />, {
        variant: "success",
      });
    } else if (error) {
      enqueueSnackbar(<Translations text="Something went wrong!" />, {
        variant: "error",
      });
    }
  }, [error, isSuccess]);

  const handleDeleteNote = (id: string) => {
    setShowDialog(true);
    setNoteId(id);
  };

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      {notes?.map((data: INote, index: number) => {
        const dateTime = dayjs(data?.metaValue?.timestamp);
        const formattedDateTime = dateTime.format("MMMM D, HH:mm");

        if (data.metaKey === "NOTES") {
          return (
            <Box key={index}>
              <Box display="flex">
                <Card
                  sx={{
                    padding: "10px",
                  }}
                >
                  <Typography>{data?.metaValue?.text}</Typography>
                </Card>
                <Icon
                  onClick={() => handleDeleteNote(data?._id)}
                  icon="ic:baseline-delete"
                  color={"gray"}
                  style={{
                    marginLeft: "5px",
                    minWidth: "30px",
                    cursor: "pointer",
                  }}
                />
              </Box>
              <Box display="flex" gap="10px" m={1}>
                <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>
                  {data?.metaValue?.leadName}
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", fontWeight: "400", color: "gray" }}
                >
                  {formattedDateTime}
                </Typography>
              </Box>
            </Box>
          );
        }
      })}
      <Card
        sx={{
          padding: "10px",
          maxHeight: "10%",
          display: "flex",
          gap: "10px",
        }}
      >
        <TextField
          placeholder={t("Type your note here...")}
          sx={{
            width: "80%",
            padding: "0px !important",
            alignSelf: "center",
            "& .MuiInputBase-input": {
              padding: "0px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button
          sx={{ width: "20%" }}
          variant="contained"
          color="primary"
          disabled={newNote.length === 0}
          onClick={handleSubmit}
        >
          {t("ADD")}
        </Button>
      </Card>
      <WarningDialog
        setShow={setShowDialog}
        content="Are you sure you want to delete this note?"
        buttonText="Confirm"
        show={showDialog}
        isLoading={isDeleting}
        onConfirm={() => deleteNote(noteId)}
      />
    </Box>
  );
}

export default NotesComponent;
