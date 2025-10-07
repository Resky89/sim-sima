// Enumerasi untuk SIM
export const SIM_ENUMS = {
  JENIS_SIM: [
    { value: "a", label: "SIM A" },
    { value: "a_umum", label: "SIM A Umum" },
    { value: "bi", label: "SIM B I" },
    { value: "bi_umum", label: "SIM B I Umum" },
    { value: "bii", label: "SIM B II" },
    { value: "bii_umum", label: "SIM B II Umum" },
    { value: "c", label: "SIM C" },
    { value: "ci", label: "SIM C I" },
    { value: "cii", label: "SIM C II" },
    { value: "d", label: "SIM D" },
    { value: "di", label: "SIM D I" }
  ],
  STATUS: [
    { value: "AKTIF", label: "Aktif" },
    { value: "TIDAK_AKTIF", label: "Tidak Aktif" },
    { value: "EXPIRED", label: "Expired" }
  ]
};

// Enumerasi untuk KTP
export const KTP_ENUMS = {
  JENIS_KELAMIN: [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" }
  ],
  AGAMA: [
    { value: "ISLAM", label: "Islam" },
    { value: "KRISTEN", label: "Kristen" },
    { value: "KATOLIK", label: "Katolik" },
    { value: "HINDU", label: "Hindu" },
    { value: "BUDDHA", label: "Buddha" },
    { value: "KONGHUCU", label: "Konghucu" }
  ],
  STATUS_PERKAWINAN: [
    { value: "BELUM_KAWIN", label: "Belum Kawin" },
    { value: "KAWIN", label: "Kawin" },
    { value: "CERAI_HIDUP", label: "Cerai Hidup" },
    { value: "CERAI_MATI", label: "Cerai Mati" }
  ]
};