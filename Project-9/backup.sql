--
-- PostgreSQL database dump
--

\restrict F3LYbwTmPLAZPUTmUagtKl6fNQcgFNXU8t46obwPl5JQfHIFaBThgjdZK4BOWlT

-- Dumped from database version 15.16 (Debian 15.16-1.pgdg13+1)
-- Dumped by pg_dump version 15.16 (Debian 15.16-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ActivityStatus; Type: TYPE; Schema: public; Owner: crm_user
--

CREATE TYPE public."ActivityStatus" AS ENUM (
    'scheduled',
    'completed',
    'cancelled'
);


ALTER TYPE public."ActivityStatus" OWNER TO crm_user;

--
-- Name: ActivityType; Type: TYPE; Schema: public; Owner: crm_user
--

CREATE TYPE public."ActivityType" AS ENUM (
    'call',
    'email',
    'meeting',
    'task',
    'note'
);


ALTER TYPE public."ActivityType" OWNER TO crm_user;

--
-- Name: DealStatus; Type: TYPE; Schema: public; Owner: crm_user
--

CREATE TYPE public."DealStatus" AS ENUM (
    'prospecting',
    'qualification',
    'needs_analysis',
    'proposal',
    'negotiation',
    'closed_won',
    'closed_lost'
);


ALTER TYPE public."DealStatus" OWNER TO crm_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: crm_user
--

CREATE TABLE public."Activity" (
    id bigint NOT NULL,
    "userId" bigint NOT NULL,
    "companyId" bigint,
    "contactId" bigint,
    "dealId" bigint,
    type public."ActivityType" NOT NULL,
    title text NOT NULL,
    description text,
    "scheduledAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    status public."ActivityStatus" NOT NULL,
    outcome text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Activity" OWNER TO crm_user;

--
-- Name: Activity_id_seq; Type: SEQUENCE; Schema: public; Owner: crm_user
--

CREATE SEQUENCE public."Activity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Activity_id_seq" OWNER TO crm_user;

--
-- Name: Activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: crm_user
--

ALTER SEQUENCE public."Activity_id_seq" OWNED BY public."Activity".id;


--
-- Name: Company; Type: TABLE; Schema: public; Owner: crm_user
--

CREATE TABLE public."Company" (
    id bigint NOT NULL,
    name text NOT NULL,
    industry text,
    address text,
    phone text,
    website text,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" bigint NOT NULL
);


ALTER TABLE public."Company" OWNER TO crm_user;

--
-- Name: Company_id_seq; Type: SEQUENCE; Schema: public; Owner: crm_user
--

CREATE SEQUENCE public."Company_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Company_id_seq" OWNER TO crm_user;

--
-- Name: Company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: crm_user
--

ALTER SEQUENCE public."Company_id_seq" OWNED BY public."Company".id;


--
-- Name: Contact; Type: TABLE; Schema: public; Owner: crm_user
--

CREATE TABLE public."Contact" (
    id bigint NOT NULL,
    "companyId" bigint NOT NULL,
    "userId" bigint NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "position" text,
    email text,
    phone text,
    mobile text,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Contact" OWNER TO crm_user;

--
-- Name: Contact_id_seq; Type: SEQUENCE; Schema: public; Owner: crm_user
--

CREATE SEQUENCE public."Contact_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Contact_id_seq" OWNER TO crm_user;

--
-- Name: Contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: crm_user
--

ALTER SEQUENCE public."Contact_id_seq" OWNED BY public."Contact".id;


--
-- Name: Deal; Type: TABLE; Schema: public; Owner: crm_user
--

CREATE TABLE public."Deal" (
    id bigint NOT NULL,
    "companyId" bigint NOT NULL,
    "userId" bigint NOT NULL,
    "contactId" bigint,
    title text NOT NULL,
    amount numeric(65,30),
    status public."DealStatus" NOT NULL,
    "expectedClosingDate" timestamp(3) without time zone,
    probability integer,
    description text,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Deal" OWNER TO crm_user;

--
-- Name: Deal_id_seq; Type: SEQUENCE; Schema: public; Owner: crm_user
--

CREATE SEQUENCE public."Deal_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Deal_id_seq" OWNER TO crm_user;

--
-- Name: Deal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: crm_user
--

ALTER SEQUENCE public."Deal_id_seq" OWNED BY public."Deal".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: crm_user
--

CREATE TABLE public."User" (
    id bigint NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'sales_person'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "passwordHash" text NOT NULL,
    "resetToken" text,
    "resetTokenExp" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO crm_user;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: crm_user
--

CREATE SEQUENCE public."User_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO crm_user;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: crm_user
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: crm_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO crm_user;

--
-- Name: Activity id; Type: DEFAULT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Activity" ALTER COLUMN id SET DEFAULT nextval('public."Activity_id_seq"'::regclass);


--
-- Name: Company id; Type: DEFAULT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Company" ALTER COLUMN id SET DEFAULT nextval('public."Company_id_seq"'::regclass);


--
-- Name: Contact id; Type: DEFAULT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Contact" ALTER COLUMN id SET DEFAULT nextval('public."Contact_id_seq"'::regclass);


--
-- Name: Deal id; Type: DEFAULT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Deal" ALTER COLUMN id SET DEFAULT nextval('public."Deal_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: crm_user
--

COPY public."Activity" (id, "userId", "companyId", "contactId", "dealId", type, title, description, "scheduledAt", "completedAt", status, outcome, "createdAt", "updatedAt", "deletedAt") FROM stdin;
2	1	2	2	2	meeting	ヒアリング会議	\N	2026-03-31 00:00:00	\N	scheduled	\N	2026-03-09 05:57:52.1	2026-03-09 05:57:52.1	\N
3	1	2	2	2	email	メール	\N	2026-03-31 00:00:00	\N	scheduled	\N	2026-03-11 05:01:28.438	2026-03-11 05:01:28.438	\N
1	1	1	1	1	meeting	受注後連絡	受注後面談です。	2026-03-04 00:00:00	\N	scheduled	\N	2026-03-09 05:55:47.186	2026-03-19 06:04:34.928	\N
4	1	4	6	6	meeting	関口さん、提案会議。	提案会議。	2026-04-30 00:00:00	\N	scheduled	\N	2026-03-23 02:05:10.488	2026-04-01 05:01:42.79	\N
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: crm_user
--

COPY public."Company" (id, name, industry, address, phone, website, note, "createdAt", "updatedAt", "userId") FROM stdin;
1	WizTech	IT	\N	\N	https://wiz-tech.jp/	\N	2026-03-09 05:54:11.989	2026-03-09 05:54:11.989	1
3	Sony	\N	\N	\N	\N	\N	2026-03-10 00:55:37.947	2026-03-10 00:55:37.947	1
4	オリエンタルランド	\N	\N	\N	\N	\N	2026-03-11 05:40:47.052	2026-03-11 05:40:47.052	1
2	任天堂	ゲーム	\N	\N	\N	\N	2026-03-09 05:56:26.386	2026-03-11 07:46:29.915	1
5	A	\N	\N	\N	\N	\N	2026-03-19 06:08:51.554	2026-03-19 06:08:51.554	1
6	B	\N	\N	\N	\N	\N	2026-03-19 06:09:01.146	2026-03-19 06:09:01.146	1
7	C	\N	\N	\N	\N	\N	2026-03-19 06:09:09.621	2026-03-19 06:09:09.621	1
8	D	\N	\N	\N	\N	\N	2026-03-19 06:09:18.502	2026-03-19 06:09:18.502	1
9	E	\N	\N	\N	\N	\N	2026-03-19 06:09:27.059	2026-03-19 06:09:27.059	1
10	F	\N	\N	\N	\N	\N	2026-03-19 06:09:37.226	2026-03-19 06:09:37.226	1
11	G	\N	\N	\N	\N	\N	2026-03-19 06:09:49.232	2026-03-19 06:09:49.232	1
12	綺譚社	出版	\N	\N	\N	\N	2026-03-23 01:55:35.078	2026-03-23 01:55:35.078	1
14	講談社	出版	文京区	\N	\N	\N	2026-04-03 07:31:50.935	2026-04-03 07:31:50.935	1
\.


--
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: crm_user
--

COPY public."Contact" (id, "companyId", "userId", "firstName", "lastName", "position", email, phone, mobile, note, "createdAt", "updatedAt", "deletedAt") FROM stdin;
2	2	1	Taro	Yamada	SE	\N	\N	\N	\N	2026-03-09 05:56:54.188	2026-03-09 05:56:54.188	\N
5	4	1	礼二郎	榎木津	\N	\N	\N	\N	\N	2026-03-23 01:53:46.721	2026-03-23 01:54:32.337	\N
6	4	1	巽	関口	\N	\N	\N	\N	\N	2026-03-23 01:54:56.035	2026-03-23 01:54:56.035	\N
7	12	1	敦子	中禅寺	\N	\N	\N	\N	\N	2026-03-23 01:56:10.56	2026-03-23 01:56:10.56	\N
1	1	1	Hidemasa	Kawana	SE	\N	\N	\N	\N	2026-03-09 05:54:38.17	2026-04-01 05:01:15.948	\N
\.


--
-- Data for Name: Deal; Type: TABLE DATA; Schema: public; Owner: crm_user
--

COPY public."Deal" (id, "companyId", "userId", "contactId", title, amount, status, "expectedClosingDate", probability, description, note, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	1	1	1	受注後面談	\N	closed_won	2026-03-19 00:00:00	\N	\N	\N	2026-03-09 05:55:12.37	2026-03-09 05:55:12.37	\N
2	2	1	2	ヒアリング	\N	qualification	2026-03-02 00:00:00	\N	\N	\N	2026-03-09 05:57:21.829	2026-03-09 05:57:21.829	\N
3	4	1	5	榎木津さん　交渉	\N	negotiation	2026-03-31 00:00:00	\N	\N	\N	2026-03-23 01:58:39.804	2026-03-23 01:58:39.804	\N
4	4	1	6	すり合わせ	\N	qualification	2026-03-31 00:00:00	\N	\N	\N	2026-03-23 01:59:35.242	2026-03-23 01:59:35.242	\N
5	12	1	7	商談	\N	proposal	2026-03-23 00:00:00	\N	\N	\N	2026-03-23 02:01:09.659	2026-03-23 02:01:09.659	\N
6	4	1	6	提案	\N	proposal	2026-03-31 00:00:00	\N	\N	\N	2026-03-23 02:01:46.462	2026-03-23 02:01:46.462	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: crm_user
--

COPY public."User" (id, name, email, role, "createdAt", "updatedAt", "passwordHash", "resetToken", "resetTokenExp") FROM stdin;
2	SalesUser	sales@example.com	sales_person	2026-03-09 05:51:00.578	2026-03-09 05:51:00.578	$2b$10$BckAAC35NXmLIvugO8MnqO4A42FExeaEf8FXWH52gfiKTapKcsMbm	\N	\N
1	Admin User	admin@example.com	admin	2026-03-09 05:50:31.719	2026-03-09 07:29:01.216	$2b$10$lvwhK3G6CbZcBVZ3GKKZ/eqBffjN/z3O4t.DAt.6B4t3IHSzbF7hO	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: crm_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4669bf89-3c49-49fc-9b4c-42aaa5b36899	ddfe6b819d3d1787d9d842b95dd7c20ba91e7ddf50f1d0d04ef8224c43551d9c	2026-03-09 05:50:02.143247+00	20260219015221_init	\N	\N	2026-03-09 05:50:02.121722+00	1
d7258439-cf82-4422-82d4-f14067b8c0a0	f4a68730788de0f5576a93df02f8662f99d16f928514739245e5a091063ce693	2026-03-09 05:50:02.154509+00	20260225011726_add_company	\N	\N	2026-03-09 05:50:02.1443+00	1
12d6851c-3e28-4dd5-ae94-8f27c9b50aab	164f2d96d37e8931cb5fa9a19196d96c86bdb81ccf6b4eff8cc348a2b018d214	2026-03-09 05:50:02.229165+00	20260225014046_add_contact_deal_activity	\N	\N	2026-03-09 05:50:02.155643+00	1
c4108550-a12c-4290-8415-edbbbc778341	6766f0424091653dd24b03df77f9c97d41a8166678336a50d4780aa89dec4fb6	2026-03-09 05:50:02.249449+00	20260303073137	\N	\N	2026-03-09 05:50:02.23024+00	1
46839fe8-1db3-40de-bead-8b839667c5dd	74e67475c230988052e18bf0f00a292db06e219a315c161b903f1ea9c5bb8fb7	2026-03-09 05:50:02.272223+00	20260304045754	\N	\N	2026-03-09 05:50:02.256077+00	1
0eeb1eb8-1851-4512-93b1-fa01d4cd7aae	4fa633f4cebd6bc1c20e432614e36c8af2b35004b28b16e66f7beb4e9c939e4d	2026-03-09 05:50:02.280763+00	20260304051355	\N	\N	2026-03-09 05:50:02.275067+00	1
\.


--
-- Name: Activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: crm_user
--

SELECT pg_catalog.setval('public."Activity_id_seq"', 4, true);


--
-- Name: Company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: crm_user
--

SELECT pg_catalog.setval('public."Company_id_seq"', 14, true);


--
-- Name: Contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: crm_user
--

SELECT pg_catalog.setval('public."Contact_id_seq"', 7, true);


--
-- Name: Deal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: crm_user
--

SELECT pg_catalog.setval('public."Deal_id_seq"', 6, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: crm_user
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- Name: Deal Deal_pkey; Type: CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Deal"
    ADD CONSTRAINT "Deal_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Activity_companyId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Activity_companyId_idx" ON public."Activity" USING btree ("companyId");


--
-- Name: Activity_contactId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Activity_contactId_idx" ON public."Activity" USING btree ("contactId");


--
-- Name: Activity_dealId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Activity_dealId_idx" ON public."Activity" USING btree ("dealId");


--
-- Name: Activity_deletedAt_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Activity_deletedAt_idx" ON public."Activity" USING btree ("deletedAt");


--
-- Name: Activity_status_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Activity_status_idx" ON public."Activity" USING btree (status);


--
-- Name: Activity_userId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Activity_userId_idx" ON public."Activity" USING btree ("userId");


--
-- Name: Company_userId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Company_userId_idx" ON public."Company" USING btree ("userId");


--
-- Name: Contact_companyId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Contact_companyId_idx" ON public."Contact" USING btree ("companyId");


--
-- Name: Contact_deletedAt_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Contact_deletedAt_idx" ON public."Contact" USING btree ("deletedAt");


--
-- Name: Contact_userId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Contact_userId_idx" ON public."Contact" USING btree ("userId");


--
-- Name: Deal_companyId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Deal_companyId_idx" ON public."Deal" USING btree ("companyId");


--
-- Name: Deal_contactId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Deal_contactId_idx" ON public."Deal" USING btree ("contactId");


--
-- Name: Deal_deletedAt_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Deal_deletedAt_idx" ON public."Deal" USING btree ("deletedAt");


--
-- Name: Deal_status_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Deal_status_idx" ON public."Deal" USING btree (status);


--
-- Name: Deal_userId_idx; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE INDEX "Deal_userId_idx" ON public."Deal" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: crm_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Activity Activity_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Activity Activity_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Activity Activity_dealId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES public."Deal"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Activity Activity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Company Company_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Contact Contact_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Contact Contact_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Deal Deal_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Deal"
    ADD CONSTRAINT "Deal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Deal Deal_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Deal"
    ADD CONSTRAINT "Deal_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Deal Deal_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: crm_user
--

ALTER TABLE ONLY public."Deal"
    ADD CONSTRAINT "Deal_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict F3LYbwTmPLAZPUTmUagtKl6fNQcgFNXU8t46obwPl5JQfHIFaBThgjdZK4BOWlT

