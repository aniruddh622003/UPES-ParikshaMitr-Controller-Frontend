"use client";
import { GetAllUFMService } from "@/services/cont-ufm.service";
import { Visibility } from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useMemo } from "react";

const UFMList = () => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const router = useRouter();

  const UFMQuery = useQuery({
    queryKey: ["ufm", controllerToken],
    queryFn: () => GetAllUFMService(controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  if (UFMQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        UFMQuery.error.response?.status +
        " : " +
        UFMQuery.error.response?.data.message,
    });
  }

  const rows = useMemo(() => {
    if (UFMQuery.data) {
      return UFMQuery.data.map((item, index) => {
        return { ...item.slot, id: index + 1 };
      });
    }
    return [];
  }, [UFMQuery.data]);

  const cols = [
    {
      field: "id",
      headerName: "#",
      width: 100,
    },
    {
      field: "date",
      headerName: "Slot Date",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>
            {format(new Date(params.value), "do MMM yyyy")}
            <Chip
              label={params.row?.timeSlot}
              color={
                params.row?.timeSlot === "Morning"
                  ? "info"
                  : params.row?.timeSlot === "Afternoon"
                  ? "warning"
                  : "primary"
              }
              sx={{ ml: 2 }}
            />
          </Typography>
        );
      },
    },
    {
      headerName: "Total Rooms",
      field: "totalRooms",
      flex: 1,
      renderCell: (params) => {
        return <Typography>{params.row?.rooms?.length}</Typography>;
      },
    },
    {
      headerName: "Total UFMS",
      field: "totalUFM",
      flex: 1,
      renderCell: (params) => {
        return <Typography>{params.row?.ufms?.length}</Typography>;
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Box>
            <Tooltip title="View UFMS" arrow placement="top">
              <IconButton
                onClick={() => {
                  router.push(`/main/ufm/${params.row._id}`);
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];
  console.log(rows);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        UFM List
        <Chip label={UFMQuery.data?.length} color="primary" sx={{ ml: 2 }} />
      </Typography>
      {UFMQuery.isLoading && <CircularProgress />}
      {UFMQuery.isSuccess && (
        <Box style={{ height: 400, width: "100%" }}>
          <DataGrid rows={rows} columns={cols} disableRowSelectionOnClick />
        </Box>
      )}
    </Box>
  );
};

export default UFMList;
