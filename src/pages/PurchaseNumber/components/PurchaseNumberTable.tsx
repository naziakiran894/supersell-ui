import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Paper,
  TableContainer,
  Button,
  TableCell,
  Card,
} from "@mui/material";
import Icon from "../../../@core/components/icon";
import WarningDialog from "../../../@core/components/warningDialog/WarningDialog";
import PaginatedTable, {
  ColumnsProps,
} from "../../../@core/components/PaginatedTable";

import { useSnackbar } from "notistack";
import PurchaseNumberDialog from "./PurchaseNumberDialog";
import {
  useGetAllPurchaseNumberQuery,
  useDeletePurchaseNumberMutation,
} from "../../../store/services/index";
import { IPurchaseNumber } from "../../../store/types/purchaseNumber.types";
import { useNavigate } from "react-router";
import APP_ROUTES from "../../../Routes/routes";
import Translations from "../../../@core/layouts/Translations";
import { useTranslation } from "react-i18next";

const PurchaseNumberTable = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [currentRowId, setCurrentRowId] = useState('');
  const [pageOffSet, setPageOffSet] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isFetching: isLoading } = useGetAllPurchaseNumberQuery({
    limit,
    offset: pageOffSet,
  });
  //@ts-ignore
  const purchaseNumberList: IPurchaseNumber[] = data?.data;
  //@ts-ignore
  const totalCount = data?.data?.length;

  const [
    handleDeleteNumber,
    { isLoading: isDeleting, isSuccess: isDeleted, error },
  ] = useDeletePurchaseNumberMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    const add = newPage > offset;
    if (add) {
      setPageOffSet(limit * newPage);
    } else {
      setPageOffSet(pageOffSet - limit);
    }
    setOffset(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };

  useEffect(() => {
    if (isDeleted) {
      setShowDialog(false);
      enqueueSnackbar(<Translations text={"Deleted successfully"} />, {
        variant: "success",
      });
    }
    if (error) {
      enqueueSnackbar(<Translations text={"Error alert!"} />, {
        variant: "error",
      });
    }
  }, [isDeleted, error]);
  return (
    <Card>
      <Box sx={{ display: "flex", justifyContent: "flex-end", m: 4 }}>
        <PurchaseNumberDialog />
      </Box>
      <TableContainer component={Paper}>
        <PaginatedTable
          id="name"
          hasCheckBox
          columns={headCells}
          items={purchaseNumberList}
          showPagination
          setSelected={setSelected}
          selected={selected}
          isLoading={isLoading}
          page={offset}
          count={totalCount}
          rowsPerPage={limit}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          renderBody={(row: any, index) => {
            return (
              <>
                <TableCell
                  key={row._id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "purple",
                      textDecorationLine: "underline",
                      textDecorationColor: "purple",
                    },
                  }}
                  component="th"
                  scope="row"
                >
                  {row.numberName}
                </TableCell>
                <TableCell align="left">{row.number}</TableCell>
                <TableCell
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(`${APP_ROUTES.purchaseNumberSetting}/${row._id}`)
                    }
                  >
                    <Translations text="SETTINGS" />
                  </Button>
                  <Box
                    onClick={() => {
                      setCurrentRowId(row._id);
                      setShowDialog(true);
                    }}
                  >
                    <Icon icon="mdi:rubbish-bin" />
                  </Box>
                </TableCell>
              </>
            );
          }}
        />
      </TableContainer>

      {showDialog && (
        <WarningDialog
          content={t("Are you sure you want to delete number?")}
          isLoading={isDeleting}
          setShow={setShowDialog}
          onConfirm={() => {
            if (currentRowId) {
              handleDeleteNumber(currentRowId);
            }
          }}
          show={showDialog}
        />
      )}
    </Card>
  );
};
export default PurchaseNumberTable;

const headCells: ColumnsProps[] = [
  {
    id: "name",
    label: "NAME",
  },
  {
    id: "number",
    label: "NUMBER",
  },

  {
    id: "",
    label: "",
  },
];
