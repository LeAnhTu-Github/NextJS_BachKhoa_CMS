"use client";
import React, { useEffect, useState } from "react";
import EmailSearchForm from "@/components/EmailConfig/EmailSearchForm";
import { EmailConfig, Status } from "@/types/Email";
import { getListEmailConfig } from "@/services/emailService";
import CustomPagination from "@/components/ui/custom-pagination";
import EmailList from "@/components/EmailConfig/EmailList";
import ModalCreateMailConfig from "@/components/EmailConfig/ModalCreateMailConfig";
import ModalUpdateMailConfig from "@/components/EmailConfig/ModalUpdateMailConfig";

type FormValues = {
  search?: string;
  status?: string;
};
const EmailConfigPage = () => {
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedEmailConfig, setSelectedEmailConfig] = useState<EmailConfig | null>(null);
  const fetchEmailConfigs = async () => {
        setLoading(true);
        try {
            const response = await getListEmailConfig({ pageIndex, pageSize, search, status });
            setEmailConfigs(response.data);
            setTotalPages(response.totalPages);
            setTotalRecords(response.totalRecords);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); 
        }
  };

  const handleSearch = (values: FormValues) => {
    const searchPayload = Object.entries(values).reduce((acc, [key, value]) => {
      if (value && value !== "") {
        acc[key as keyof FormValues] = value;
      }
      return acc;
    }, {} as FormValues);

    setSearch(searchPayload.search || "");
    setStatus(searchPayload.status as Status);
    setPageIndex(1);
  };
  const onEdit = (emailConfig: EmailConfig) => {
    setSelectedEmailConfig(emailConfig);
    setOpenUpdateModal(true);
  }

  const refresh = async() => {
    setPageIndex(1);
    setPageSize(50);
    setSearch("");
    setStatus(undefined);
  };

  useEffect(() => {
    fetchEmailConfigs();
  }, [pageIndex, pageSize, search, status]);
  
  return (
    <div className="p-3 flex flex-col gap-3 max-h-[calc(100vh-100px)] overflow-y-auto">
      <EmailSearchForm
        emailCount={totalRecords}
        onSearch={handleSearch}
        onRefresh={refresh}
        onAdd={() => setOpenCreateModal(true)}
      />
      <EmailList
        emailConfigs={emailConfigs}
        isLoading={loading}
        onRefresh={fetchEmailConfigs}
        onEdit={onEdit}
      />
       <CustomPagination
          setTotalPages={setTotalPages}
          currentPage={pageIndex}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(page) => setPageIndex(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />
        <ModalCreateMailConfig
          open={openCreateModal}
          onOpenChange={setOpenCreateModal}
          onRefresh={fetchEmailConfigs}
        />
        <ModalUpdateMailConfig
          open={openUpdateModal}
          onOpenChange={setOpenUpdateModal}
          onRefresh={fetchEmailConfigs}
          mailConfig={selectedEmailConfig as EmailConfig}
        />
    </div>
  );
};

export default EmailConfigPage;
