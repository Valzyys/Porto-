/**
 * Referensi API @jkt48/core v7.7.7 — ditulis dari kode sumber
 * (dist/index.esm.js). Satu sumber untuk halaman API, tabel endpoint,
 * halaman /modules, dan pencarian.
 *
 * Bentuk respons tidak didokumentasikan di paket (semua method mengembalikan
 * `response.data` apa adanya), jadi di sini ditulis `Promise<object>` dan
 * pembaca diarahkan ke dokumentasi API resmi untuk skema datanya.
 */

export type HttpVerb = "GET" | "POST" | "PUT" | "DELETE";

export type Param = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
};

export type Method = {
  /** nama method, mis. "getMembers" */
  name: string;
  description: string;
  verb: HttpVerb;
  /** path relatif terhadap BASE_URL; parameter ditulis {nama} */
  path: string;
  /** query/body tambahan yang dibentuk method ini */
  sends?: string;
  params: Param[];
  returns: string;
  example: string;
  notes?: string[];
  auth: "apiKey" | "admin";
};

export type Module = {
  id: string;
  /** properti di instance client, mis. "members" → client.members */
  prop: string | null;
  title: string;
  /** nama class di sumber */
  className: string;
  summary: string;
  methods: Method[];
};

const noParams: Param[] = [];

export const modules: Module[] = [
  {
    id: "client",
    prop: null,
    title: "Client",
    className: "JKT48Client",
    summary: "Konstruktor, pengecekan status API, dan pengganti kredensial saat runtime.",
    methods: [
      {
        name: "check",
        description: "Cek status API JKT48Connect untuk API key yang sedang dipakai.",
        verb: "GET",
        path: "/zenova/check",
        params: noParams,
        returns: "Promise<object>",
        example: `const status = await client.check();\nconsole.log(status);`,
        auth: "apiKey",
      },
      {
        name: "setApiKey",
        description: "Ganti API key pada instance yang sama. Berlaku untuk request berikutnya.",
        verb: "GET",
        path: "—",
        params: [{ name: "newApiKey", type: "string", required: true, description: "API key baru." }],
        returns: "void",
        example: `client.setApiKey("NEW_API_KEY");`,
        notes: ["Bukan request HTTP — hanya mengubah state lokal client."],
        auth: "apiKey",
      },
      {
        name: "setPriorityToken",
        description: "Pasang atau ganti priority token untuk request berikutnya.",
        verb: "GET",
        path: "—",
        params: [{ name: "newPriorityToken", type: "string", required: true, description: "Token prioritas, mis. \"P-ABCD1234\"." }],
        returns: "void",
        example: `client.setPriorityToken("P-NEWTOKEN");`,
        notes: ["Bukan request HTTP — hanya mengubah state lokal client."],
        auth: "apiKey",
      },
      {
        name: "setAdminCredentials",
        description: "Pasang atau ganti kredensial admin untuk modul Admin.",
        verb: "GET",
        path: "—",
        params: [
          { name: "credentials.username", type: "string", required: true, description: "Username admin." },
          { name: "credentials.password", type: "string", required: true, description: "Password admin." },
        ],
        returns: "void",
        example: `client.setAdminCredentials({\n  username: "newadmin",\n  password: "newpassword",\n});`,
        notes: ["Bukan request HTTP — hanya mengubah state lokal client."],
        auth: "admin",
      },
    ],
  },
  {
    id: "members",
    prop: "members",
    title: "Members",
    className: "MembersService",
    summary: "Daftar member, detail per nama, dan ulang tahun.",
    methods: [
      {
        name: "getMembers",
        description: "Ambil semua member JKT48.",
        verb: "GET",
        path: "/jkt48/members",
        params: noParams,
        returns: "Promise<object>",
        example: `const members = await client.members.getMembers();`,
        auth: "apiKey",
      },
      {
        name: "getMemberDetail",
        description: "Ambil detail satu member berdasarkan nama.",
        verb: "GET",
        path: "/jkt48/member/{name}",
        params: [{ name: "name", type: "string", required: true, description: "Nama member. Di-encode otomatis (encodeURIComponent)." }],
        returns: "Promise<object>",
        example: `const detail = await client.members.getMemberDetail("Shani");`,
        auth: "apiKey",
      },
      {
        name: "getBirthdays",
        description: "Ambil informasi ulang tahun member.",
        verb: "GET",
        path: "/jkt48/birthday",
        params: noParams,
        returns: "Promise<object>",
        example: `const birthdays = await client.members.getBirthdays();`,
        auth: "apiKey",
      },
    ],
  },
  {
    id: "live",
    prop: "live",
    title: "Live",
    className: "LiveService",
    summary: "Live streaming saat ini (YouTube, IDN, Showroom), riwayat, replay, dan chat stream.",
    methods: [
      {
        name: "getLive",
        description: "Ambil semua live stream yang sedang berlangsung.",
        verb: "GET",
        path: "/jkt48/live",
        params: noParams,
        returns: "Promise<object>",
        example: `const live = await client.live.getLive();`,
        auth: "apiKey",
      },
      {
        name: "getYoutubeLive",
        description: "Ambil live stream YouTube.",
        verb: "GET",
        path: "/jkt48/live/youtube",
        params: noParams,
        returns: "Promise<object>",
        example: `const yt = await client.live.getYoutubeLive();`,
        auth: "apiKey",
      },
      {
        name: "getIdnLive",
        description: "Ambil live stream IDN.",
        verb: "GET",
        path: "/jkt48/live/idn",
        params: noParams,
        returns: "Promise<object>",
        example: `const idn = await client.live.getIdnLive();`,
        auth: "apiKey",
      },
      {
        name: "getShowroomLive",
        description: "Ambil live stream Showroom.",
        verb: "GET",
        path: "/jkt48/live/showroom",
        params: noParams,
        returns: "Promise<object>",
        example: `const showroom = await client.live.getShowroomLive();`,
        auth: "apiKey",
      },
      {
        name: "getRecent",
        description: "Ambil daftar stream yang baru selesai.",
        verb: "GET",
        path: "/jkt48/recent",
        params: noParams,
        returns: "Promise<object>",
        example: `const recent = await client.live.getRecent();`,
        auth: "apiKey",
      },
      {
        name: "getRecentDetail",
        description: "Ambil detail satu stream dari daftar recent.",
        verb: "GET",
        path: "/jkt48/recent/{liveId}",
        params: [{ name: "liveId", type: "string", required: true, description: "ID live stream. Tidak di-encode — kirim ID apa adanya." }],
        returns: "Promise<object>",
        example: `const detail = await client.live.getRecentDetail("live123");`,
        auth: "apiKey",
      },
      {
        name: "getReplay",
        description: "Ambil daftar replay stream.",
        verb: "GET",
        path: "/jkt48/replay",
        params: noParams,
        returns: "Promise<object>",
        example: `const replay = await client.live.getReplay();`,
        auth: "apiKey",
      },
      {
        name: "getChatStream",
        description: "Ambil chat stream sebuah live (IDN).",
        verb: "GET",
        path: "/jkt48/chat-stream",
        sends: "?username={username}&slug={slug}",
        params: [
          { name: "username", type: "string", required: true, description: "Username pemilik stream. Di-encode otomatis." },
          { name: "slug", type: "string", required: true, description: "Slug stream. Di-encode otomatis." },
        ],
        returns: "Promise<object>",
        example: `const chat = await client.live.getChatStream("username", "slug");`,
        auth: "apiKey",
      },
      {
        name: "getChatStreamShowroom",
        description: "Ambil chat stream room Showroom.",
        verb: "GET",
        path: "/jkt48/chat-stream-sr",
        sends: "?room_id={roomId}",
        params: [{ name: "roomId", type: "string", required: true, description: "ID room Showroom. Di-encode otomatis." }],
        returns: "Promise<object>",
        example: `const chat = await client.live.getChatStreamShowroom("roomId");`,
        auth: "apiKey",
      },
    ],
  },
  {
    id: "events",
    prop: "events",
    title: "Events",
    className: "EventsService",
    summary: "Event, jadwal theater, detail show, dan jadwal video call.",
    methods: [
      {
        name: "getEvents",
        description: "Ambil semua event.",
        verb: "GET",
        path: "/jkt48/events",
        params: noParams,
        returns: "Promise<object>",
        example: `const events = await client.events.getEvents();`,
        auth: "apiKey",
      },
      {
        name: "getTheater",
        description: "Ambil jadwal theater.",
        verb: "GET",
        path: "/jkt48/theater",
        params: noParams,
        returns: "Promise<object>",
        example: `const theater = await client.events.getTheater();`,
        auth: "apiKey",
      },
      {
        name: "getTheaterDetail",
        description: "Ambil detail satu show theater.",
        verb: "GET",
        path: "/jkt48/theater/{id}",
        params: [{ name: "id", type: "string", required: true, description: "ID show theater. Tidak di-encode." }],
        returns: "Promise<object>",
        example: `const show = await client.events.getTheaterDetail("theater123");`,
        auth: "apiKey",
      },
      {
        name: "getVideoCall",
        description: "Ambil jadwal video call, bisa difilter per sesi, tanggal, dan member.",
        verb: "GET",
        path: "/jkt48/videocall",
        sends: "?sesi=&date=&member= (hanya yang diisi)",
        params: [
          { name: "sesi", type: "string", required: false, default: '""', description: "Sesi, mis. \"sesi1\". Kosong = tidak difilter." },
          { name: "date", type: "string", required: false, default: '""', description: "Tanggal, mis. \"2024-01-01\". Kosong = tidak difilter." },
          { name: "member", type: "string", required: false, default: '""', description: "Nama member. Kosong = tidak difilter." },
        ],
        returns: "Promise<object>",
        example: `// semua jadwal\nawait client.events.getVideoCall();\n\n// difilter\nawait client.events.getVideoCall("sesi1", "2024-01-01", "Shani");`,
        notes: ["Parameter kosong tidak dikirim sama sekali, jadi urutan tetap harus dijaga: isi \"\" untuk melewati filter."],
        auth: "apiKey",
      },
      {
        name: "getVideoCallToday",
        description: "Ambil jadwal video call hari ini.",
        verb: "GET",
        path: "/jkt48/videocall/today",
        params: noParams,
        returns: "Promise<object>",
        example: `const today = await client.events.getVideoCallToday();`,
        auth: "apiKey",
      },
    ],
  },
  {
    id: "media",
    prop: "media",
    title: "Media",
    className: "MediaService",
    summary: "Video YouTube, berita, dan detail berita.",
    methods: [
      {
        name: "getYoutube",
        description: "Ambil video YouTube.",
        verb: "GET",
        path: "/jkt48/youtube",
        params: noParams,
        returns: "Promise<object>",
        example: `const videos = await client.media.getYoutube();`,
        auth: "apiKey",
      },
      {
        name: "getNews",
        description: "Ambil daftar berita.",
        verb: "GET",
        path: "/jkt48/news",
        params: noParams,
        returns: "Promise<object>",
        example: `const news = await client.media.getNews();`,
        auth: "apiKey",
      },
      {
        name: "getNewsDetail",
        description: "Ambil detail satu berita.",
        verb: "GET",
        path: "/jkt48/news/{id}",
        params: [{ name: "id", type: "string", required: true, description: "ID berita. Tidak di-encode." }],
        returns: "Promise<object>",
        example: `const article = await client.media.getNewsDetail("news123");`,
        auth: "apiKey",
      },
    ],
  },
  {
    id: "admin",
    prop: "admin",
    title: "Admin",
    className: "AdminService",
    summary: "Kelola API key dan statistik. Butuh kredensial admin.",
    methods: [
      {
        name: "getKeys",
        description: "Ambil semua API key.",
        verb: "GET",
        path: "/admin/keys",
        params: noParams,
        returns: "Promise<object>",
        example: `const keys = await client.admin.getKeys();`,
        auth: "admin",
      },
      {
        name: "getKeyDetail",
        description: "Ambil detail satu API key.",
        verb: "GET",
        path: "/admin/key/{key}",
        params: [{ name: "key", type: "string", required: true, description: "API key yang dicari. Di-encode otomatis." }],
        returns: "Promise<object>",
        example: `const info = await client.admin.getKeyDetail("key123");`,
        auth: "admin",
      },
      {
        name: "createKey",
        description: "Buat API key baru.",
        verb: "POST",
        path: "/admin/create-key",
        sends: "?owner=&email=&type=&apikey= (type & apikey hanya jika diisi)",
        params: [
          { name: "owner", type: "string", required: true, description: "Nama pemilik key." },
          { name: "email", type: "string", required: true, description: "Email pemilik key." },
          { name: "type", type: "string", required: false, default: '""', description: "Tipe key, mis. \"premium\"." },
          { name: "apikey", type: "string", required: false, default: '""', description: "Key kustom. Tidak tercantum di README, tapi ada di kode sumber." },
        ],
        returns: "Promise<object>",
        example: `await client.admin.createKey("owner", "email@example.com", "premium");\n\n// dengan key kustom\nawait client.admin.createKey("owner", "email@example.com", "premium", "MY-CUSTOM-KEY");`,
        notes: ["Semua nilai dikirim lewat query string, body POST kosong (kecuali priority_token)."],
        auth: "admin",
      },
      {
        name: "updateKey",
        description: "Ubah status aktif dan tipe sebuah API key.",
        verb: "PUT",
        path: "/admin/update-key",
        sends: "?key=&active=&type=",
        params: [
          { name: "key", type: "string", required: true, description: "API key yang diubah." },
          { name: "active", type: "boolean", required: true, description: "Status aktif. Dikirim sebagai teks \"true\"/\"false\"." },
          { name: "type", type: "string", required: true, description: "Tipe key." },
        ],
        returns: "Promise<object>",
        example: `await client.admin.updateKey("key123", true, "premium");`,
        auth: "admin",
      },
      {
        name: "deleteKey",
        description: "Hapus sebuah API key.",
        verb: "DELETE",
        path: "/admin/key/{key}",
        params: [{ name: "key", type: "string", required: true, description: "API key yang dihapus." }],
        returns: "Promise<object>",
        example: `await client.admin.deleteKey("key123");`,
        auth: "admin",
      },
      {
        name: "addLimit",
        description: "Tambah kuota request pada sebuah API key.",
        verb: "POST",
        path: "/admin/add-limit",
        sends: "?key=&additionalLimit=",
        params: [
          { name: "key", type: "string", required: true, description: "API key." },
          { name: "additionalLimit", type: "number", required: true, description: "Jumlah limit yang ditambahkan." },
        ],
        returns: "Promise<object>",
        example: `await client.admin.addLimit("key123", 1000);`,
        auth: "admin",
      },
      {
        name: "addExpiry",
        description: "Perpanjang masa berlaku sebuah API key.",
        verb: "POST",
        path: "/admin/add-expiry",
        sends: "?key=&additionalDays=",
        params: [
          { name: "key", type: "string", required: true, description: "API key." },
          { name: "additionalDays", type: "number", required: true, description: "Jumlah hari yang ditambahkan." },
        ],
        returns: "Promise<object>",
        example: `await client.admin.addExpiry("key123", 30);`,
        auth: "admin",
      },
      {
        name: "getStats",
        description: "Ambil statistik admin.",
        verb: "GET",
        path: "/admin/stats",
        params: noParams,
        returns: "Promise<object>",
        example: `const stats = await client.admin.getStats();`,
        auth: "admin",
      },
    ],
  },
  {
    id: "changelog",
    prop: "changelog",
    title: "Changelog",
    className: "ChangelogService",
    summary: "Baca dan kelola entri changelog di database API.",
    methods: [
      {
        name: "getChangelogs",
        description: "Ambil semua changelog.",
        verb: "GET",
        path: "/database/changelogs",
        params: noParams,
        returns: "Promise<object>",
        example: `const logs = await client.changelog.getChangelogs();`,
        auth: "apiKey",
      },
      {
        name: "getChangelogDetail",
        description: "Ambil detail satu changelog.",
        verb: "GET",
        path: "/database/changelog/{id}",
        params: [{ name: "id", type: "string", required: true, description: "ID changelog." }],
        returns: "Promise<object>",
        example: `const log = await client.changelog.getChangelogDetail("changelog123");`,
        auth: "apiKey",
      },
      {
        name: "createChangelog",
        description: "Buat changelog baru.",
        verb: "POST",
        path: "/database/create-changelog",
        sends: "body JSON = data",
        params: [{ name: "data", type: "object", required: true, description: "Isi changelog, mis. { title, content }." }],
        returns: "Promise<object>",
        example: `await client.changelog.createChangelog({\n  title: "Update",\n  content: "New features",\n});`,
        notes: ["Objek data dimutasi: jika priority token aktif, properti priority_token ditambahkan ke objek yang kamu kirim."],
        auth: "apiKey",
      },
      {
        name: "updateChangelog",
        description: "Ubah changelog.",
        verb: "PUT",
        path: "/database/changelog/{id}",
        sends: "body JSON = data",
        params: [
          { name: "id", type: "string", required: true, description: "ID changelog." },
          { name: "data", type: "object", required: true, description: "Field yang diubah." },
        ],
        returns: "Promise<object>",
        example: `await client.changelog.updateChangelog("changelog123", { title: "Updated" });`,
        auth: "apiKey",
      },
      {
        name: "deleteChangelog",
        description: "Hapus changelog.",
        verb: "DELETE",
        path: "/database/changelog/{id}",
        params: [{ name: "id", type: "string", required: true, description: "ID changelog." }],
        returns: "Promise<object>",
        example: `await client.changelog.deleteChangelog("changelog123");`,
        auth: "apiKey",
      },
    ],
  },
  {
    id: "garden",
    prop: "garden",
    title: "Grow A Garden",
    className: "GardenService",
    summary: "Data game Grow A Garden: stok, cuaca, timer restock, dan semuanya sekaligus.",
    methods: [
      {
        name: "getStock",
        description: "Ambil informasi stok.",
        verb: "GET",
        path: "/growagarden/stock",
        params: noParams,
        returns: "Promise<object>",
        example: `const stock = await client.garden.getStock();`,
        auth: "apiKey",
      },
      {
        name: "getWeather",
        description: "Ambil informasi cuaca.",
        verb: "GET",
        path: "/growagarden/weather",
        params: noParams,
        returns: "Promise<object>",
        example: `const weather = await client.garden.getWeather();`,
        auth: "apiKey",
      },
      {
        name: "getRestockTimer",
        description: "Ambil timer restock.",
        verb: "GET",
        path: "/growagarden/restock-timer",
        params: noParams,
        returns: "Promise<object>",
        example: `const timer = await client.garden.getRestockTimer();`,
        auth: "apiKey",
      },
      {
        name: "getAll",
        description: "Ambil semua data garden sekaligus.",
        verb: "GET",
        path: "/growagarden/all",
        params: noParams,
        returns: "Promise<object>",
        example: `const all = await client.garden.getAll();`,
        auth: "apiKey",
      },
    ],
  },
];

/** method yang benar-benar memanggil HTTP (tanpa setter lokal) */
export const httpMethods = modules.flatMap((m) =>
  m.methods.filter((x) => x.path !== "—").map((x) => ({ ...x, module: m })),
);

export const methodCount = modules.reduce((n, m) => n + m.methods.length, 0);

export function callOf(m: Module, method: Method): string {
  return m.prop ? `client.${m.prop}.${method.name}` : `client.${method.name}`;
}

export function signatureOf(m: Module, method: Method): string {
  const args = method.params
    .filter((p) => !p.name.includes("."))
    .map((p) => `${p.name}${p.required ? "" : "?"}`);
  const hasCred = method.params.some((p) => p.name.startsWith("credentials."));
  const list = hasCred ? ["credentials"] : args;
  return `${callOf(m, method)}(${list.join(", ")})`;
}

export function anchorOf(method: Method): string {
  return method.name.toLowerCase();
}
