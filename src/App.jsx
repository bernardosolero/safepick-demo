import { useMemo, useState } from "react"

/* =========================================================
   DEMO DATA
========================================================= */

const ROLE_NAMES = {
  parent: "Parent / Guardian",
  personnel: "Pickup Personnel",
  teacher: "Teacher",
  admin: "School Administrator",
}

const DEMO_ACCOUNTS = {
  parent: {
    name: "Maria Reyes",
    role: "Parent / Guardian",
    email: "parent@safepick.app",
    password: "safepick",
  },

  personnel: {
    name: "Mr. Dela Cruz",
    role: "Pickup Verification Personnel",
    email: "guard@safepick.app",
    password: "safepick",
  },

  teacher: {
    name: "Ms. Santos",
    role: "Teacher",
    email: "teacher@safepick.app",
    password: "safepick",
  },

  admin: {
    name: "Ms. Ana Cruz",
    role: "School Administrator",
    email: "admin@safepick.app",
    password: "safepick",
  },
}

const INITIAL_STUDENTS = [
  {
    id: "stu-001",
    name: "Sofia Reyes",
    grade: "Grade 2",
    section: "St. Luke",
    studentNumber: "2026-0142",
    status: "Waiting for Pickup",
  },

  {
    id: "stu-002",
    name: "Miguel Reyes",
    grade: "Kindergarten",
    section: "Hope",
    studentNumber: "2026-0068",
    status: "Waiting for Pickup",
  },

  {
    id: "stu-003",
    name: "Angela Cruz",
    grade: "Grade 2",
    section: "St. Luke",
    studentNumber: "2026-0175",
    status: "Picked Up",
  },

  {
    id: "stu-004",
    name: "Daniel Flores",
    grade: "Grade 2",
    section: "St. Luke",
    studentNumber: "2026-0121",
    status: "Fetcher Arrived",
  },

  {
    id: "stu-005",
    name: "Liam Flores",
    grade: "Grade 3",
    section: "St. Matthew",
    studentNumber: "2026-0204",
    status: "Waiting for Pickup",
  },
]

const INITIAL_FETCHERS = [
  {
    id: "fet-001",
    name: "Maria Reyes",
    relationship: "Mother",
    contact: "0992 319 0823",
    status: "Approved",
    credential: "SP-2026-0042",
    studentIds: ["stu-001", "stu-002"],
  },

  {
    id: "fet-002",
    name: "Juan Reyes",
    relationship: "Father",
    contact: "0917 555 0135",
    status: "Approved",
    credential: "SP-2026-0051",
    studentIds: ["stu-001", "stu-002"],
  },

  {
    id: "fet-003",
    name: "Elena Cruz",
    relationship: "Mother",
    contact: "0918 445 7741",
    status: "Approved",
    credential: "SP-2026-0094",
    studentIds: ["stu-003"],
  },
]

const INITIAL_REQUESTS = [
  {
    id: "req-001",
    name: "Carla Santos",
    relationship: "Aunt",
    contact: "0920 332 8144",
    studentId: "stu-001",
    requestedBy: "Maria Reyes",
    status: "Pending",
  },
]

const INITIAL_PARENT_NOTIFICATIONS = [
  {
    id: "pn-001",
    title: "Pickup Confirmed",
    message: "Sofia Reyes was picked up by Juan Reyes.",
    time: "Yesterday • 4:18 PM",
    type: "success",
  },
]

const INITIAL_TEACHER_NOTIFICATIONS = [
  {
    id: "tn-001",
    title: "Student Picked Up",
    message: "Angela Cruz • Grade 2 – St. Luke",
    time: "4:18 PM",
    type: "success",
  },
]

const INITIAL_RECORDS = [
  {
    id: "PK-2026-0001",
    studentId: "stu-003",
    studentName: "Angela Cruz",
    fetcherName: "Elena Cruz",
    relationship: "Mother",
    time: "4:18 PM",
    date: "October 16, 2026",
    verifiedBy: "Mr. Dela Cruz",
    smsStatus: "Sent",
  },
]

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [mode, setMode] = useState("presentation")

  const [leftRole, setLeftRole] = useState("parent")
  const [rightRole, setRightRole] = useState("personnel")
  const [singleRole, setSingleRole] = useState("parent")

  const [schoolOffline, setSchoolOffline] = useState(false)

  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [fetchers, setFetchers] = useState(INITIAL_FETCHERS)
  const [fetcherRequests, setFetcherRequests] =
    useState(INITIAL_REQUESTS)

  const [parentNotifications, setParentNotifications] =
    useState(INITIAL_PARENT_NOTIFICATIONS)

  const [teacherNotifications, setTeacherNotifications] =
    useState(INITIAL_TEACHER_NOTIFICATIONS)

  const [pickupRecords, setPickupRecords] =
    useState(INITIAL_RECORDS)

  const resetSystem = () => {
    setStudents(INITIAL_STUDENTS)
    setFetchers(INITIAL_FETCHERS)
    setFetcherRequests(INITIAL_REQUESTS)
    setParentNotifications(INITIAL_PARENT_NOTIFICATIONS)
    setTeacherNotifications(INITIAL_TEACHER_NOTIFICATIONS)
    setPickupRecords(INITIAL_RECORDS)
    setSchoolOffline(false)
  }

  const markFetcherArrived = (studentId) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId &&
        student.status !== "Picked Up"
          ? {
              ...student,
              status: "Fetcher Arrived",
            }
          : student
      )
    )
  }

  const confirmPickup = ({
    studentId,
    fetcherName,
    relationship,
    verifiedBy,
  }) => {
    const student =
      students.find(
        (item) => item.id === studentId
      ) || students[0]

    const now = new Date()

    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    const record = {
      id: `PK-2026-${String(
        pickupRecords.length + 1
      ).padStart(4, "0")}`,

      studentId: student.id,

      studentName: student.name,

      fetcherName,

      relationship,

      time,

      date: now.toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),

      verifiedBy,

      smsStatus: "Sent",
    }

    setStudents((current) =>
      current.map((item) =>
        item.id === studentId
          ? {
              ...item,
              status: "Picked Up",
            }
          : item
      )
    )

    setPickupRecords((current) => [
      record,
      ...current,
    ])

    setParentNotifications((current) => [
      {
        id: `pn-${Date.now()}`,
        title: "Pickup Confirmed",
        message: `${student.name} was picked up by ${fetcherName}.`,
        time: `Today • ${time}`,
        type: "success",
      },
      ...current,
    ])

    setTeacherNotifications((current) => [
      {
        id: `tn-${Date.now()}`,
        title: "Student Picked Up",
        message: `${student.name} • ${student.grade} – ${student.section}`,
        time,
        type: "success",
      },
      ...current,
    ])

    return record
  }

  const submitFetcherRequest = ({
    name,
    relationship,
    contact,
    studentId,
  }) => {
    const request = {
      id: `req-${Date.now()}`,
      name,
      relationship,
      contact,
      studentId,
      requestedBy: "Maria Reyes",
      status: "Pending",
    }

    setFetcherRequests((current) => [
      request,
      ...current,
    ])

    return request
  }

  const approveFetcherRequest = (requestId) => {
    const request = fetcherRequests.find(
      (item) => item.id === requestId
    )

    if (!request) return

    setFetcherRequests((current) =>
      current.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: "Approved",
            }
          : item
      )
    )

    setFetchers((current) => [
      ...current,
      {
        id: `fet-${Date.now()}`,
        name: request.name,
        relationship: request.relationship,
        contact: request.contact,
        status: "Approved",
        credential: `SP-2026-${String(
          current.length + 70
        ).padStart(4, "0")}`,
        studentIds: [request.studentId],
      },
    ])
  }

  return (
    <main className="site-shell">
      <header className="presentation-header">
        <div className="presentation-brand">
          <div className="presentation-logo">
            S
          </div>

          <div>
            <h1>
              SafePick
            </h1>

            <p>
              CHANCETEAM CHRISTIAN ACADEMY, INC.
            </p>
          </div>
        </div>

        <div className="presentation-actions">
          <div className="mode-switch">
            <button
              type="button"
              className={
                mode === "presentation"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode("presentation")
              }
            >
              Presentation Mode
            </button>

            <button
              type="button"
              className={
                mode === "single"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode("single")
              }
            >
              Single Device
            </button>
          </div>

          <button
            type="button"
            className={
              schoolOffline
                ? "offline-control active"
                : "offline-control"
            }
            onClick={() =>
              setSchoolOffline(
                (value) => !value
              )
            }
          >
            {schoolOffline
              ? "Local Mode Active"
              : "Simulate School Offline"}
          </button>

          <button
            type="button"
            className="reset-control"
            onClick={resetSystem}
          >
            Reset System
          </button>
        </div>
      </header>

      {schoolOffline && (
        <div className="global-local-mode">
          <div>
            <strong>
              LOCAL MODE ACTIVE
            </strong>

            <span>
              Internet unavailable. SafePick is using
              the school local network and database.
            </span>
          </div>

          <div className="local-mode-items">
            <StatusPill
              text="Internet Offline"
              tone="danger"
            />

            <StatusPill
              text="Local Server Connected"
              tone="success"
            />

            <StatusPill
              text="Database Connected"
              tone="success"
            />

            <StatusPill
              text="SMS Gateway Ready"
              tone="success"
            />
          </div>
        </div>
      )}

      {mode === "presentation" ? (
        <PresentationMode
          leftRole={leftRole}
          setLeftRole={setLeftRole}
          rightRole={rightRole}
          setRightRole={setRightRole}
          students={students}
          fetchers={fetchers}
          fetcherRequests={fetcherRequests}
          parentNotifications={
            parentNotifications
          }
          teacherNotifications={
            teacherNotifications
          }
          pickupRecords={pickupRecords}
          schoolOffline={schoolOffline}
          markFetcherArrived={
            markFetcherArrived
          }
          confirmPickup={confirmPickup}
          submitFetcherRequest={
            submitFetcherRequest
          }
          approveFetcherRequest={
            approveFetcherRequest
          }
        />
      ) : (
        <SingleDeviceMode
          role={singleRole}
          setRole={setSingleRole}
          students={students}
          fetchers={fetchers}
          fetcherRequests={fetcherRequests}
          parentNotifications={
            parentNotifications
          }
          teacherNotifications={
            teacherNotifications
          }
          pickupRecords={pickupRecords}
          schoolOffline={schoolOffline}
          markFetcherArrived={
            markFetcherArrived
          }
          confirmPickup={confirmPickup}
          submitFetcherRequest={
            submitFetcherRequest
          }
          approveFetcherRequest={
            approveFetcherRequest
          }
        />
      )}
    </main>
  )
}

/* =========================================================
   PRESENTATION MODE
========================================================= */

function PresentationMode({
  leftRole,
  setLeftRole,
  rightRole,
  setRightRole,

  students,
  fetchers,
  fetcherRequests,

  parentNotifications,
  teacherNotifications,

  pickupRecords,

  schoolOffline,

  markFetcherArrived,
  confirmPickup,

  submitFetcherRequest,
  approveFetcherRequest,
}) {
  return (
    <>
      <section className="presentation-intro">
        <div>
          <span className="eyebrow">
            INTERACTIVE SYSTEM VIEW
          </span>

          <h2>
            See SafePick from different users'
            perspectives.
          </h2>

          <p>
            Both phones use the same SafePick system
            state. Actions completed on one device can
            update the other device in real time.
          </p>
        </div>
      </section>

      <section className="role-controller">
        <div className="role-control">
          <span>
            LEFT DEVICE
          </span>

          <select
            value={leftRole}
            onChange={(event) =>
              setLeftRole(event.target.value)
            }
          >
            <option value="parent">
              Parent / Guardian
            </option>

            <option value="teacher">
              Teacher
            </option>

            <option value="admin">
              School Administrator
            </option>

            <option value="personnel">
              Pickup Personnel
            </option>
          </select>
        </div>

        <div className="connection-label">
          SHARED SAFEPICK SYSTEM
        </div>

        <div className="role-control">
          <span>
            RIGHT DEVICE
          </span>

          <select
            value={rightRole}
            onChange={(event) =>
              setRightRole(event.target.value)
            }
          >
            <option value="personnel">
              Pickup Personnel
            </option>

            <option value="parent">
              Parent / Guardian
            </option>

            <option value="teacher">
              Teacher
            </option>

            <option value="admin">
              School Administrator
            </option>
          </select>
        </div>
      </section>

      <section className="phone-presentation">
        <DeviceColumn
          title={ROLE_NAMES[leftRole]}
          subtitle="DEVICE 01"
        >
          <DeviceApp
            key={`left-${leftRole}`}
            role={leftRole}
            students={students}
            fetchers={fetchers}
            fetcherRequests={fetcherRequests}
            parentNotifications={
              parentNotifications
            }
            teacherNotifications={
              teacherNotifications
            }
            pickupRecords={pickupRecords}
            schoolOffline={schoolOffline}
            markFetcherArrived={
              markFetcherArrived
            }
            confirmPickup={confirmPickup}
            submitFetcherRequest={
              submitFetcherRequest
            }
            approveFetcherRequest={
              approveFetcherRequest
            }
          />
        </DeviceColumn>

        <div className="phone-connector">
          <span>
            SYNC
          </span>

          <strong>
            ⇄
          </strong>
        </div>

        <DeviceColumn
          title={ROLE_NAMES[rightRole]}
          subtitle="DEVICE 02"
        >
          <DeviceApp
            key={`right-${rightRole}`}
            role={rightRole}
            students={students}
            fetchers={fetchers}
            fetcherRequests={fetcherRequests}
            parentNotifications={
              parentNotifications
            }
            teacherNotifications={
              teacherNotifications
            }
            pickupRecords={pickupRecords}
            schoolOffline={schoolOffline}
            markFetcherArrived={
              markFetcherArrived
            }
            confirmPickup={confirmPickup}
            submitFetcherRequest={
              submitFetcherRequest
            }
            approveFetcherRequest={
              approveFetcherRequest
            }
          />
        </DeviceColumn>
      </section>
    </>
  )
}

/* =========================================================
   SINGLE DEVICE MODE
========================================================= */

function SingleDeviceMode({
  role,
  setRole,

  students,
  fetchers,
  fetcherRequests,

  parentNotifications,
  teacherNotifications,

  pickupRecords,

  schoolOffline,

  markFetcherArrived,
  confirmPickup,

  submitFetcherRequest,
  approveFetcherRequest,
}) {
  return (
    <section className="single-device-section">
      <div className="single-device-controller">
        <div>
          <span className="eyebrow">
            SINGLE DEVICE VIEW
          </span>

          <h2>
            SafePick Mobile App
          </h2>
        </div>

        <label>
          Prototype Account

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
          >
            <option value="parent">
              Parent / Guardian
            </option>

            <option value="personnel">
              Pickup Personnel
            </option>

            <option value="teacher">
              Teacher
            </option>

            <option value="admin">
              School Administrator
            </option>
          </select>
        </label>
      </div>

      <DeviceApp
        key={`single-${role}`}
        role={role}
        students={students}
        fetchers={fetchers}
        fetcherRequests={fetcherRequests}
        parentNotifications={
          parentNotifications
        }
        teacherNotifications={
          teacherNotifications
        }
        pickupRecords={pickupRecords}
        schoolOffline={schoolOffline}
        markFetcherArrived={
          markFetcherArrived
        }
        confirmPickup={confirmPickup}
        submitFetcherRequest={
          submitFetcherRequest
        }
        approveFetcherRequest={
          approveFetcherRequest
        }
      />
    </section>
  )
}

/* =========================================================
   DEVICE WRAPPER
========================================================= */

function DeviceColumn({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="device-column">
      <div className="device-heading">
        <div>
          <span className="eyebrow">
            {subtitle}
          </span>

          <h3>
            {title}
          </h3>
        </div>

        <span className="phone-chip">
          MOBILE
        </span>
      </div>

      {children}
    </div>
  )
}

function DeviceApp({
  role,

  students,
  fetchers,
  fetcherRequests,

  parentNotifications,
  teacherNotifications,

  pickupRecords,

  schoolOffline,

  markFetcherArrived,
  confirmPickup,

  submitFetcherRequest,
  approveFetcherRequest,
}) {
  const [loggedIn, setLoggedIn] =
    useState(false)

  const [showWelcome, setShowWelcome] =
    useState(false)

  const login = () => {
    setLoggedIn(true)
    setShowWelcome(true)
  }

  const logout = () => {
    setLoggedIn(false)
    setShowWelcome(false)
  }

  return (
    <div className="phone-frame">
      <div className="phone-hardware">
        <span />
      </div>

      <div className="phone-screen">
        <PhoneStatusBar />

        {!loggedIn ? (
          <LoginScreen
            role={role}
            onLogin={login}
          />
        ) : (
          <div className="logged-app">
            {role === "parent" && (
              <ParentApp
                students={students}
                fetchers={fetchers}
                fetcherRequests={
                  fetcherRequests
                }
                notifications={
                  parentNotifications
                }
                submitFetcherRequest={
                  submitFetcherRequest
                }
                onLogout={logout}
              />
            )}

            {role === "personnel" && (
              <PersonnelApp
                students={students}
                fetchers={fetchers}
                pickupRecords={
                  pickupRecords
                }
                schoolOffline={
                  schoolOffline
                }
                markFetcherArrived={
                  markFetcherArrived
                }
                confirmPickup={
                  confirmPickup
                }
                onLogout={logout}
              />
            )}

            {role === "teacher" && (
              <TeacherApp
                students={students}
                notifications={
                  teacherNotifications
                }
                onLogout={logout}
              />
            )}

            {role === "admin" && (
              <AdminApp
                students={students}
                fetchers={fetchers}
                fetcherRequests={
                  fetcherRequests
                }
                pickupRecords={
                  pickupRecords
                }
                approveFetcherRequest={
                  approveFetcherRequest
                }
                onLogout={logout}
              />
            )}

            {showWelcome && (
              <WelcomeModal
                role={role}
                students={students}
                onClose={() =>
                  setShowWelcome(false)
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   LOGIN
========================================================= */

function LoginScreen({
  role,
  onLogin,
}) {
  const account = DEMO_ACCOUNTS[role]

  const [email, setEmail] = useState(
    account.email
  )

  const [password, setPassword] =
    useState(account.password)

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] =
    useState("")

  const submit = (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError(
        "Enter your username and password."
      )

      return
    }

    setError("")
    onLogin()
  }

  return (
    <div className="login-screen">
      <div className="login-brand">
        <div className="app-logo">
          S
        </div>

        <h2>
          SafePick
        </h2>

        <p>
          Student Pickup Verification &
          Monitoring System
        </p>
      </div>

      <div className="login-role">
        Demo Account
        <strong>
          {account.role}
        </strong>
      </div>

      <form
        className="login-form"
        onSubmit={submit}
      >
        <label>
          Email / Username

          <input
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter username"
          />
        </label>

        <label>
          Password

          <div className="password-field">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter password"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
            >
              {showPassword
                ? "HIDE"
                : "SHOW"}
            </button>
          </div>
        </label>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="mobile-primary-button"
        >
          LOGIN
        </button>
      </form>

      <div className="registration-help">
        <strong>
          No account or not registered?
        </strong>

        <p>
          Please contact the school
          administrator to register.
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   WELCOME MODAL
========================================================= */

function WelcomeModal({
  role,
  students,
  onClose,
}) {
  const account = DEMO_ACCOUNTS[role]

  return (
    <div className="modal-overlay">
      <div className="welcome-modal">
        <div className="welcome-check">
          ✓
        </div>

        <span className="eyebrow">
          WELCOME TO SAFEPICK
        </span>

        <h3>
          Hello, {account.name}.
        </h3>

        {role === "parent" && (
          <>
            <p>
              Students linked to your account:
            </p>

            <div className="welcome-students">
              {students
                .filter((student) =>
                  [
                    "stu-001",
                    "stu-002",
                  ].includes(student.id)
                )
                .map((student) => (
                  <div
                    key={student.id}
                    className="welcome-student"
                  >
                    <strong>
                      {student.name}
                    </strong>

                    <span>
                      {student.grade} •{" "}
                      {student.section}
                    </span>

                    <small>
                      Student No.{" "}
                      {student.studentNumber}
                    </small>
                  </div>
                ))}
            </div>
          </>
        )}

        {role === "personnel" && (
          <p>
            Your pickup verification account
            is ready.
          </p>
        )}

        {role === "teacher" && (
          <p>
            Your assigned classes and student
            pickup statuses are ready.
          </p>
        )}

        {role === "admin" && (
          <p>
            Administrator tools and school
            records are ready.
          </p>
        )}

        <button
          type="button"
          className="mobile-primary-button"
          onClick={onClose}
        >
          CONTINUE
        </button>
      </div>
    </div>
  )
}

/* =========================================================
   PARENT APP
========================================================= */

function ParentApp({
  students,
  fetchers,
  fetcherRequests,
  notifications,
  submitFetcherRequest,
  onLogout,
}) {
  const linkedStudents = students.filter(
    (student) =>
      [
        "stu-001",
        "stu-002",
      ].includes(student.id)
  )

  const [selectedStudentId, setSelectedStudentId] =
    useState("stu-001")

  const [screen, setScreen] =
    useState("home")

  const selectedStudent =
    linkedStudents.find(
      (student) =>
        student.id === selectedStudentId
    ) || linkedStudents[0]

  const approvedFetchers =
    fetchers.filter((fetcher) =>
      fetcher.studentIds.includes(
        selectedStudent.id
      )
    )

  const pendingRequests =
    fetcherRequests.filter(
      (request) =>
        request.studentId ===
          selectedStudent.id &&
        request.status === "Pending"
    )

  return (
    <RoleLayout
      bottomNav={
        <BottomNav
          items={[
            {
              key: "home",
              label: "HOME",
              symbol: "⌂",
            },

            {
              key: "notifications",
              label: "NOTIFICATIONS",
              symbol: "●",
            },

            {
              key: "settings",
              label: "SETTINGS",
              symbol: "⚙",
            },
          ]}
          active={
            [
              "home",
              "notifications",
              "settings",
            ].includes(screen)
              ? screen
              : ""
          }
          onChange={setScreen}
        />
      }
    >
      {screen === "home" && (
        <ParentHome
          selectedStudent={
            selectedStudent
          }
          linkedStudents={
            linkedStudents
          }
          selectedStudentId={
            selectedStudentId
          }
          setSelectedStudentId={
            setSelectedStudentId
          }
          onFetchers={() =>
            setScreen("fetchers")
          }
          onQr={() =>
            setScreen("qr")
          }
        />
      )}

      {screen === "fetchers" && (
        <ParentFetchers
          student={selectedStudent}
          fetchers={approvedFetchers}
          pendingRequests={
            pendingRequests
          }
          onBack={() =>
            setScreen("home")
          }
          onRequest={() =>
            setScreen("request")
          }
        />
      )}

      {screen === "request" && (
        <FetcherRequestForm
          student={selectedStudent}
          onBack={() =>
            setScreen("fetchers")
          }
          onSubmit={(data) => {
            submitFetcherRequest({
              ...data,
              studentId:
                selectedStudent.id,
            })

            setScreen(
              "request-success"
            )
          }}
        />
      )}

      {screen ===
        "request-success" && (
        <RequestSuccess
          onDone={() =>
            setScreen("fetchers")
          }
        />
      )}

      {screen === "qr" && (
        <ParentQr
          student={selectedStudent}
          onBack={() =>
            setScreen("home")
          }
        />
      )}

      {screen ===
        "notifications" && (
        <NotificationScreen
          title="Notifications"
          notifications={
            notifications
          }
        />
      )}

      {screen === "settings" && (
        <SettingsScreen
          role="Parent / Guardian"
          onLogout={onLogout}
        />
      )}
    </RoleLayout>
  )
}

function ParentHome({
  selectedStudent,
  linkedStudents,
  selectedStudentId,
  setSelectedStudentId,
  onFetchers,
  onQr,
}) {
  return (
    <div className="mobile-page">
      <AppHeader
        title="Good afternoon, Maria"
        subtitle="Parent / Guardian"
      />

      <div className="student-selector-card">
        <label>
          Linked Student

          <select
            value={selectedStudentId}
            onChange={(event) =>
              setSelectedStudentId(
                event.target.value
              )
            }
          >
            {linkedStudents.map(
              (student) => (
                <option
                  value={student.id}
                  key={student.id}
                >
                  {student.name}
                </option>
              )
            )}
          </select>
        </label>

        <div className="selected-student">
          <Avatar
            initials={getInitials(
              selectedStudent.name
            )}
            tone="blue"
          />

          <div>
            <strong>
              {selectedStudent.name}
            </strong>

            <span>
              {selectedStudent.grade} •{" "}
              {selectedStudent.section}
            </span>

            <StatusPill
              text={
                selectedStudent.status
              }
              tone={statusTone(
                selectedStudent.status
              )}
            />
          </div>
        </div>
      </div>

      <div className="home-action-grid">
        <button
          type="button"
          className="large-home-action"
          onClick={onFetchers}
        >
          <span className="large-action-icon">
            👥
          </span>

          <strong>
            Authorized Fetchers
          </strong>

          <p>
            View approved people or request
            another fetcher.
          </p>

          <small>
            OPEN →
          </small>
        </button>

        <button
          type="button"
          className="large-home-action qr-action"
          onClick={onQr}
        >
          <span className="large-action-icon">
            ▣
          </span>

          <strong>
            Show My Pickup QR
          </strong>

          <p>
            Present your registered pickup
            credential.
          </p>

          <small>
            SHOW QR →
          </small>
        </button>
      </div>

      <div className="tip-card">
        <strong>
          Offline tip
        </strong>

        <p>
          Save or print your QR credential
          before pickup if mobile data or Wi-Fi
          may not be available.
        </p>
      </div>
    </div>
  )
}

function ParentFetchers({
  student,
  fetchers,
  pendingRequests,
  onBack,
  onRequest,
}) {
  return (
    <div className="mobile-page">
      <SubPageHeader
        title="Authorized Fetchers"
        subtitle={student.name}
        onBack={onBack}
      />

      <div className="stack-list">
        {fetchers.map((fetcher) => (
          <PersonCard
            key={fetcher.id}
            name={fetcher.name}
            subtitle={
              fetcher.relationship
            }
            status="APPROVED"
            tone="success"
          />
        ))}

        {pendingRequests.map(
          (request) => (
            <PersonCard
              key={request.id}
              name={request.name}
              subtitle={
                request.relationship
              }
              status="PENDING SCHOOL APPROVAL"
              tone="warning"
            />
          )
        )}
      </div>

      <button
        type="button"
        className="mobile-primary-button"
        onClick={onRequest}
      >
        + REQUEST NEW FETCHER
      </button>

      <div className="safe-info">
        New fetchers cannot be activated
        immediately. School approval is required.
      </div>
    </div>
  )
}

function FetcherRequestForm({
  student,
  onBack,
  onSubmit,
}) {
  const [name, setName] =
    useState("")

  const [relationship, setRelationship] =
    useState("")

  const [contact, setContact] =
    useState("")

  const [error, setError] =
    useState("")

  const submit = (event) => {
    event.preventDefault()

    if (
      !name.trim() ||
      !relationship.trim() ||
      !contact.trim()
    ) {
      setError(
        "Complete all required information."
      )

      return
    }

    onSubmit({
      name,
      relationship,
      contact,
    })
  }

  return (
    <div className="mobile-page">
      <SubPageHeader
        title="Request New Fetcher"
        subtitle={student.name}
        onBack={onBack}
      />

      <form
        className="mobile-form"
        onSubmit={submit}
      >
        <label>
          Full Name

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Fetcher full name"
          />
        </label>

        <label>
          Relationship

          <input
            value={relationship}
            onChange={(event) =>
              setRelationship(
                event.target.value
              )
            }
            placeholder="Example: Aunt"
          />
        </label>

        <label>
          Contact Number

          <input
            value={contact}
            onChange={(event) =>
              setContact(
                event.target.value
              )
            }
            placeholder="09XX XXX XXXX"
          />
        </label>

        <label>
          Photo

          <div className="upload-placeholder">
            PHOTO UPLOAD
            <span>
              Prototype placeholder
            </span>
          </div>
        </label>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="mobile-primary-button"
        >
          SUBMIT REQUEST
        </button>
      </form>
    </div>
  )
}

function RequestSuccess({
  onDone,
}) {
  return (
    <CenteredState
      icon="✓"
      tone="success"
      eyebrow="REQUEST SUBMITTED"
      title="School approval required"
      description="The requested fetcher must be reviewed and approved by the school administrator before becoming active."
      buttonText="DONE"
      onButton={onDone}
    />
  )
}

function ParentQr({
  student,
  onBack,
}) {
  return (
    <div className="mobile-page">
      <SubPageHeader
        title="Pickup Credential"
        subtitle="Maria Reyes • Mother"
        onBack={onBack}
      />

      <div className="credential-card">
        <div className="credential-top">
          <div>
            <span>
              SAFEPICK
            </span>

            <strong>
              AUTHORIZED FETCHER PASS
            </strong>
          </div>

          <StatusPill
            text="ACTIVE"
            tone="success"
          />
        </div>

        <Avatar
          initials="MR"
          tone="blue"
          large
        />

        <h3>
          Maria Reyes
        </h3>

        <p>
          Mother
        </p>

        <FakeQr />

        <div className="credential-code">
          SP-2026-0042
        </div>

        <div className="credential-student">
          <span>
            AUTHORIZED STUDENT
          </span>

          <strong>
            {student.name}
          </strong>

          <small>
            {student.grade} •{" "}
            {student.section}
          </small>
        </div>
      </div>

      <div className="button-stack">
        <button
          type="button"
          className="mobile-primary-button"
        >
          SAVE QR
        </button>

        <button
          type="button"
          className="mobile-secondary-button"
        >
          PRINT / DOWNLOAD CREDENTIAL
        </button>
      </div>

      <div className="tip-card">
        <strong>
          No internet during pickup?
        </strong>

        <p>
          Use a previously saved or printed copy
          of this credential.
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   PERSONNEL APP
========================================================= */

function PersonnelApp({
  students,
  fetchers,
  pickupRecords,
  schoolOffline,
  markFetcherArrived,
  confirmPickup,
  onLogout,
}) {
  const [screen, setScreen] =
    useState("home")

  const [selectedStudentId, setSelectedStudentId] =
    useState(null)

  const [lastRecord, setLastRecord] =
    useState(null)

  const scannedFetcher =
    fetchers.find(
      (fetcher) =>
        fetcher.id === "fet-001"
    ) || fetchers[0]

  const selectedStudent =
    students.find(
      (student) =>
        student.id === selectedStudentId
    )

  const authorizedStudents =
    students.filter((student) =>
      scannedFetcher.studentIds.includes(
        student.id
      )
    )

  const chooseScannedStudent = (
    studentId
  ) => {
    setSelectedStudentId(studentId)

    markFetcherArrived(studentId)

    setScreen("verification")
  }

  const completePickup = () => {
    if (!selectedStudent) return

    const record = confirmPickup({
      studentId:
        selectedStudent.id,

      fetcherName:
        scannedFetcher.name,

      relationship:
        scannedFetcher.relationship,

      verifiedBy:
        DEMO_ACCOUNTS.personnel.name,
    })

    setLastRecord(record)
    setScreen("success")
  }

  const completeManualPickup = (
    student
  ) => {
    setSelectedStudentId(student.id)

    const availableFetcher =
      fetchers.find((fetcher) =>
        fetcher.studentIds.includes(
          student.id
        )
      )

    const record = confirmPickup({
      studentId: student.id,

      fetcherName:
        availableFetcher?.name ||
        "Registered Fetcher",

      relationship:
        availableFetcher?.relationship ||
        "Authorized Fetcher",

      verifiedBy:
        DEMO_ACCOUNTS.personnel.name,
    })

    setLastRecord(record)
    setScreen("success")
  }

  return (
    <RoleLayout
      bottomNav={
        <BottomNav
          items={[
            {
              key: "home",
              label: "HOME",
              symbol: "⌂",
            },

            {
              key: "dashboard",
              label: "PICKUP",
              symbol: "▦",
            },

            {
              key: "settings",
              label: "SETTINGS",
              symbol: "⚙",
            },
          ]}
          active={
            [
              "home",
              "dashboard",
              "settings",
            ].includes(screen)
              ? screen
              : ""
          }
          onChange={setScreen}
        />
      }
    >
      {screen === "home" && (
        <PersonnelHome
          schoolOffline={
            schoolOffline
          }
          onScan={() =>
            setScreen("scanner")
          }
          onDashboard={() =>
            setScreen("dashboard")
          }
        />
      )}

      {screen === "scanner" && (
        <QrScanner
          onBack={() =>
            setScreen("home")
          }
          onValid={() =>
            setScreen("scan-valid")
          }
          onInvalid={() =>
            setScreen("scan-invalid")
          }
        />
      )}

      {screen ===
        "scan-invalid" && (
        <InvalidCredential
          onScanAgain={() =>
            setScreen("scanner")
          }
          onDashboard={() =>
            setScreen("dashboard")
          }
        />
      )}

      {screen === "scan-valid" && (
        <ValidScan
          fetcher={scannedFetcher}
          students={authorizedStudents}
          onSelect={
            chooseScannedStudent
          }
          onBack={() =>
            setScreen("scanner")
          }
        />
      )}

      {screen === "verification" &&
        selectedStudent && (
          <FetcherVerification
            fetcher={
              scannedFetcher
            }
            student={
              selectedStudent
            }
            onConfirm={() =>
              setScreen("release")
            }
            onReject={() =>
              setScreen("rejected")
            }
            onBack={() =>
              setScreen("scan-valid")
            }
          />
        )}

      {screen === "rejected" && (
        <RejectedVerification
          onScanner={() =>
            setScreen("scanner")
          }
          onDashboard={() =>
            setScreen("dashboard")
          }
        />
      )}

      {screen === "release" &&
        selectedStudent && (
          <ReleaseConfirmation
            student={
              selectedStudent
            }
            fetcher={
              scannedFetcher
            }
            onBack={() =>
              setScreen(
                "verification"
              )
            }
            onConfirm={
              completePickup
            }
          />
        )}

      {screen === "success" &&
        lastRecord && (
          <PickupSuccess
            record={lastRecord}
            onRecord={() =>
              setScreen("record")
            }
            onDone={() =>
              setScreen("home")
            }
          />
        )}

      {screen === "record" &&
        lastRecord && (
          <PickupRecordScreen
            record={lastRecord}
            onBack={() =>
              setScreen("home")
            }
          />
        )}

      {screen === "dashboard" && (
        <PickupDashboard
          students={students}
          schoolOffline={
            schoolOffline
          }
          onStudent={(student) => {
            setSelectedStudentId(
              student.id
            )

            setScreen(
              "manual-student"
            )
          }}
        />
      )}

      {screen ===
        "manual-student" &&
        selectedStudent && (
          <ManualStudentPickup
            student={
              selectedStudent
            }
            fetchers={fetchers.filter(
              (fetcher) =>
                fetcher.studentIds.includes(
                  selectedStudent.id
                )
            )}
            schoolOffline={
              schoolOffline
            }
            onBack={() =>
              setScreen("dashboard")
            }
            onConfirm={() =>
              completeManualPickup(
                selectedStudent
              )
            }
          />
        )}

      {screen === "settings" && (
        <SettingsScreen
          role="Pickup Personnel"
          onLogout={onLogout}
        />
      )}
    </RoleLayout>
  )
}

function PersonnelHome({
  schoolOffline,
  onScan,
  onDashboard,
}) {
  return (
    <div className="mobile-page">
      <AppHeader
        title="Good afternoon"
        subtitle="Mr. Dela Cruz • Pickup Personnel"
      />

      {schoolOffline && (
        <div className="mobile-offline-banner">
          <strong>
            LOCAL MODE ACTIVE
          </strong>

          <p>
            School internet is offline. Local
            pickup records remain available.
          </p>
        </div>
      )}

      <button
        type="button"
        className="scan-main-button"
        onClick={onScan}
      >
        <span>
          ▣
        </span>

        <strong>
          SCAN QR
        </strong>

        <p>
          Begin pickup verification
        </p>
      </button>

      <button
        type="button"
        className="dashboard-home-button"
        onClick={onDashboard}
      >
        OPEN PICKUP DASHBOARD
      </button>

      <div className="system-status-card">
        <SystemRow
          label="Local Database"
          value="CONNECTED"
          tone="success"
        />

        <SystemRow
          label="SMS Gateway"
          value="READY"
          tone="success"
        />

        <SystemRow
          label="Internet"
          value={
            schoolOffline
              ? "OFFLINE"
              : "ONLINE"
          }
          tone={
            schoolOffline
              ? "danger"
              : "success"
          }
        />
      </div>
    </div>
  )
}

function QrScanner({
  onBack,
  onValid,
  onInvalid,
}) {
  return (
    <div className="mobile-page scanner-page">
      <SubPageHeader
        title="Scan Pickup QR"
        subtitle="Digital or printed credential"
        onBack={onBack}
      />

      <div className="mobile-scanner">
        <div className="scanner-corner top-left" />
        <div className="scanner-corner top-right" />
        <div className="scanner-corner bottom-left" />
        <div className="scanner-corner bottom-right" />

        <FakeQr />

        <div className="moving-scan-line" />
      </div>

      <p className="scanner-instruction">
        Position the fetcher's QR credential
        inside the frame.
      </p>

      <div className="prototype-controls">
        <span>
          PROTOTYPE SCAN RESULT
        </span>

        <button
          type="button"
          className="mobile-primary-button"
          onClick={onValid}
        >
          SIMULATE VALID QR
        </button>

        <button
          type="button"
          className="mobile-danger-button"
          onClick={onInvalid}
        >
          SIMULATE INVALID QR
        </button>
      </div>
    </div>
  )
}

function InvalidCredential({
  onScanAgain,
  onDashboard,
}) {
  return (
    <CenteredState
      icon="✕"
      tone="danger"
      eyebrow="CREDENTIAL NOT FOUND"
      title="Do not release the student"
      description="This QR credential does not match a registered SafePick account. Ask the fetcher to contact the school administrator if registration or authorization is required."
      customButtons={
        <>
          <button
            type="button"
            className="mobile-primary-button"
            onClick={onScanAgain}
          >
            SCAN AGAIN
          </button>

          <button
            type="button"
            className="mobile-secondary-button"
            onClick={onDashboard}
          >
            OPEN PICKUP DASHBOARD
          </button>
        </>
      }
    />
  )
}

function ValidScan({
  fetcher,
  students,
  onSelect,
  onBack,
}) {
  return (
    <div className="mobile-page">
      <SubPageHeader
        title="QR Scan Successful"
        subtitle="Registered credential found"
        onBack={onBack}
      />

      <div className="success-strip">
        ✓ VALID SAFEPICK CREDENTIAL
      </div>

      <div className="fetcher-profile-card">
        <Avatar
          initials={getInitials(
            fetcher.name
          )}
          tone="blue"
          large
        />

        <h3>
          {fetcher.name}
        </h3>

        <p>
          {fetcher.relationship}
        </p>

        <div className="dual-status">
          <StatusPill
            text="REGISTERED"
            tone="success"
          />

          <StatusPill
            text="AUTHORIZED"
            tone="success"
          />
        </div>

        <small>
          Credential {fetcher.credential}
        </small>
      </div>

      <div className="section-title-row">
        <div>
          <span className="eyebrow">
            AUTHORIZED STUDENTS
          </span>

          <h3>
            Select student
          </h3>
        </div>
      </div>

      <div className="stack-list">
        {students.map((student) => (
          <button
            type="button"
            className="student-select-card"
            key={student.id}
            onClick={() =>
              onSelect(student.id)
            }
          >
            <Avatar
              initials={getInitials(
                student.name
              )}
              tone="soft"
            />

            <div>
              <strong>
                {student.name}
              </strong>

              <span>
                {student.grade} •{" "}
                {student.section}
              </span>
            </div>

            <b>
              →
            </b>
          </button>
        ))}
      </div>
    </div>
  )
}

function FetcherVerification({
  fetcher,
  student,
  onConfirm,
  onReject,
  onBack,
}) {
  return (
    <div className="mobile-page">
      <SubPageHeader
        title="Verify Fetcher"
        subtitle="Visual verification required"
        onBack={onBack}
      />

      <div className="verification-photo-card">
        <Avatar
          initials={getInitials(
            fetcher.name
          )}
          tone="blue"
          xlarge
        />

        <h3>
          {fetcher.name}
        </h3>

        <p>
          {fetcher.relationship}
        </p>

        <StatusPill
          text="AUTHORIZED"
          tone="success"
        />
      </div>

      <div className="linked-student-box">
        <span>
          PICKING UP
        </span>

        <strong>
          {student.name}
        </strong>

        <small>
          {student.grade} •{" "}
          {student.section}
        </small>
      </div>

      <div className="important-warning">
        <strong>
          Visual verification required
        </strong>

        <p>
          Compare the person presenting this
          credential with the registered
          photograph and information. The QR
          credential alone is not final proof of
          identity.
        </p>
      </div>

      <div className="button-stack">
        <button
          type="button"
          className="mobile-success-button"
          onClick={onConfirm}
        >
          ✓ CONFIRM FETCHER
        </button>

        <button
          type="button"
          className="mobile-danger-button"
          onClick={onReject}
        >
          REJECT / CANNOT VERIFY
        </button>
      </div>
    </div>
  )
}

function RejectedVerification({
  onScanner,
  onDashboard,
}) {
  return (
    <CenteredState
      icon="!"
      tone="warning"
      eyebrow="VERIFICATION NOT CONFIRMED"
      title="Do not release through SafePick"
      description="Follow the school's established authorization procedure. Contact the parent, guardian, or school administration when necessary."
      customContent={
        <div className="safe-actions">
          <span>
            Contact Parent / Guardian
          </span>

          <span>
            Contact School Administration
          </span>

          <span>
            Review Student Record
          </span>
        </div>
      }
      customButtons={
        <>
          <button
            type="button"
            className="mobile-primary-button"
            onClick={onScanner}
          >
            RETURN TO SCANNER
          </button>

          <button
            type="button"
            className="mobile-secondary-button"
            onClick={onDashboard}
          >
            OPEN STUDENT RECORDS
          </button>
        </>
      }
    />
  )
}

function ReleaseConfirmation({
  student,
  fetcher,
  onBack,
  onConfirm,
}) {
  return (
    <div className="mobile-page">
      <SubPageHeader
        title="Student Release"
        subtitle="Final confirmation"
        onBack={onBack}
      />

      <div className="release-chain">
        <PersonSummary
          title="STUDENT"
          name={student.name}
          subtitle={`${student.grade} • ${student.section}`}
          initials={getInitials(
            student.name
          )}
        />

        <div className="release-chain-arrow">
          ↓
        </div>

        <PersonSummary
          title="VERIFIED FETCHER"
          name={fetcher.name}
          subtitle={fetcher.relationship}
          initials={getInitials(
            fetcher.name
          )}
        />
      </div>

      <div className="important-warning">
        <strong>
          Confirm student release?
        </strong>

        <p>
          Confirm only after the student has
          been physically released to the
          verified fetcher.
        </p>
      </div>

      <div className="verification-meta">
        <DataRow
          label="Verified By"
          value="Mr. Dela Cruz"
        />

        <DataRow
          label="Action"
          value="Student Release"
        />
      </div>

      <div className="button-stack">
        <button
          type="button"
          className="mobile-success-button"
          onClick={onConfirm}
        >
          CONFIRM STUDENT RELEASE
        </button>

        <button
          type="button"
          className="mobile-secondary-button"
          onClick={onBack}
        >
          GO BACK
        </button>
      </div>
    </div>
  )
}

function PickupSuccess({
  record,
  onRecord,
  onDone,
}) {
  return (
    <CenteredState
      icon="✓"
      tone="success"
      eyebrow="TRANSACTION COMPLETE"
      title="Pickup Confirmed"
      description={`${record.studentName} has been marked as Picked Up.`}
      customContent={
        <>
          <div className="pickup-summary">
            <DataRow
              label="Fetcher"
              value={
                record.fetcherName
              }
            />

            <DataRow
              label="Pickup Time"
              value={record.time}
            />

            <DataRow
              label="Record"
              value={record.id}
            />

            <DataRow
              label="SMS"
              value="Sent"
            />
          </div>

          <div className="completion-checks">
            <span>
              ✓ Record saved
            </span>

            <span>
              ✓ Student status updated
            </span>

            <span>
              ✓ SMS notification sent
            </span>
          </div>
        </>
      }
      customButtons={
        <>
          <button
            type="button"
            className="mobile-primary-button"
            onClick={onRecord}
          >
            VIEW RECORD
          </button>

          <button
            type="button"
            className="mobile-secondary-button"
            onClick={onDone}
          >
            DONE
          </button>
        </>
      }
    />
  )
}

function PickupDashboard({
  students,
  schoolOffline,
  onStudent,
}) {
  const sectionStudents =
    students.filter(
      (student) =>
        student.section ===
        "St. Luke"
    )

  const waiting =
    sectionStudents.filter(
      (student) =>
        student.status ===
        "Waiting for Pickup"
    ).length

  const arrived =
    sectionStudents.filter(
      (student) =>
        student.status ===
        "Fetcher Arrived"
    ).length

  const picked =
    sectionStudents.filter(
      (student) =>
        student.status ===
        "Picked Up"
    ).length

  return (
    <div className="mobile-page">
      <AppHeader
        title="Pickup Dashboard"
        subtitle={
          schoolOffline
            ? "Offline / Local Mode"
            : "Live Monitoring"
        }
      />

      <label className="mobile-select-label">
        Section

        <select defaultValue="st-luke">
          <option value="st-luke">
            Grade 2 – St. Luke
          </option>

          <option value="st-matthew">
            Grade 3 – St. Matthew
          </option>
        </select>
      </label>

      <div className="mini-stats">
        <MiniStat
          number={waiting}
          label="Waiting"
          tone="warning"
        />

        <MiniStat
          number={arrived}
          label="Arrived"
          tone="blue"
        />

        <MiniStat
          number={picked}
          label="Picked Up"
          tone="success"
        />
      </div>

      <div className="student-status-list">
        {sectionStudents.map(
          (student) => (
            <button
              type="button"
              className="status-student-row"
              key={student.id}
              onClick={() =>
                onStudent(student)
              }
            >
              <Avatar
                initials={getInitials(
                  student.name
                )}
                tone="soft"
              />

              <div>
                <strong>
                  {student.name}
                </strong>

                <span>
                  {student.grade} •{" "}
                  {student.section}
                </span>
              </div>

              <StatusPill
                text={student.status}
                tone={statusTone(
                  student.status
                )}
              />
            </button>
          )
        )}
      </div>
    </div>
  )
}

function ManualStudentPickup({
  student,
  fetchers,
  schoolOffline,
  onBack,
  onConfirm,
}) {
  return (
    <div className="mobile-page">
      <SubPageHeader
        title={student.name}
        subtitle="Manual Pickup Processing"
        onBack={onBack}
      />

      {schoolOffline && (
        <div className="mobile-offline-banner">
          <strong>
            LOCAL DATABASE
          </strong>

          <p>
            This pickup can be recorded locally.
          </p>
        </div>
      )}

      <PersonSummary
        title="STUDENT"
        name={student.name}
        subtitle={`${student.grade} • ${student.section}`}
        initials={getInitials(
          student.name
        )}
      />

      <div className="section-title-row">
        <div>
          <span className="eyebrow">
            REGISTERED FETCHERS
          </span>

          <h3>
            Authorized people
          </h3>
        </div>
      </div>

      <div className="stack-list">
        {fetchers.map((fetcher) => (
          <PersonCard
            key={fetcher.id}
            name={fetcher.name}
            subtitle={
              fetcher.relationship
            }
            status="APPROVED"
            tone="success"
          />
        ))}
      </div>

      <div className="important-warning">
        <strong>
          Manual verification
        </strong>

        <p>
          Confirm the fetcher's identity before
          processing the pickup manually.
        </p>
      </div>

      <button
        type="button"
        className="mobile-success-button"
        onClick={onConfirm}
      >
        CONFIRM MANUAL PICKUP
      </button>
    </div>
  )
}

function PickupRecordScreen({
  record,
  onBack,
}) {
  return (
    <div className="mobile-page">
      <SubPageHeader
        title="Pickup Record"
        subtitle={record.id}
        onBack={onBack}
      />

      <div className="record-card">
        <StatusPill
          text="COMPLETED"
          tone="success"
        />

        <DataRow
          label="Student"
          value={
            record.studentName
          }
        />

        <DataRow
          label="Fetcher"
          value={
            record.fetcherName
          }
        />

        <DataRow
          label="Relationship"
          value={
            record.relationship
          }
        />

        <DataRow
          label="Date"
          value={record.date}
        />

        <DataRow
          label="Pickup Time"
          value={record.time}
        />

        <DataRow
          label="Verified By"
          value={
            record.verifiedBy
          }
        />

        <DataRow
          label="SMS Notification"
          value={
            record.smsStatus
          }
        />
      </div>
    </div>
  )
}

/* =========================================================
   TEACHER APP
========================================================= */

function TeacherApp({
  students,
  notifications,
  onLogout,
}) {
  const [screen, setScreen] =
    useState("classes")

  const [selectedSection, setSelectedSection] =
    useState("St. Luke")

  const sectionStudents =
    students.filter(
      (student) =>
        student.section ===
        selectedSection
    )

  return (
    <RoleLayout
      bottomNav={
        <BottomNav
          items={[
            {
              key: "classes",
              label: "MY CLASSES",
              symbol: "▦",
            },

            {
              key: "notifications",
              label: "NOTIFICATIONS",
              symbol: "●",
            },

            {
              key: "settings",
              label: "SETTINGS",
              symbol: "⚙",
            },
          ]}
          active={
            [
              "classes",
              "notifications",
              "settings",
            ].includes(screen)
              ? screen
              : ""
          }
          onChange={setScreen}
        />
      }
    >
      {screen === "classes" && (
        <div className="mobile-page">
          <AppHeader
            title="Good afternoon"
            subtitle="Ms. Santos • Teacher"
          />

          <span className="eyebrow">
            MY CLASSES
          </span>

          <div className="class-grid">
            <ClassCard
              grade="Grade 2"
              section="St. Luke"
              students="32 Students"
              onClick={() => {
                setSelectedSection(
                  "St. Luke"
                )

                setScreen(
                  "class-status"
                )
              }}
            />

            <ClassCard
              grade="Grade 3"
              section="St. Matthew"
              students="29 Students"
              onClick={() => {
                setSelectedSection(
                  "St. Matthew"
                )

                setScreen(
                  "class-status"
                )
              }}
            />
          </div>
        </div>
      )}

      {screen ===
        "class-status" && (
        <TeacherClassStatus
          section={
            selectedSection
          }
          students={
            sectionStudents
          }
          onBack={() =>
            setScreen("classes")
          }
        />
      )}

      {screen ===
        "notifications" && (
        <NotificationScreen
          title="Pickup Notifications"
          notifications={
            notifications
          }
        />
      )}

      {screen === "settings" && (
        <SettingsScreen
          role="Teacher"
          onLogout={onLogout}
        />
      )}
    </RoleLayout>
  )
}

function TeacherClassStatus({
  section,
  students,
  onBack,
}) {
  const waiting =
    students.filter(
      (student) =>
        student.status ===
        "Waiting for Pickup"
    ).length

  const arrived =
    students.filter(
      (student) =>
        student.status ===
        "Fetcher Arrived"
    ).length

  const picked =
    students.filter(
      (student) =>
        student.status ===
        "Picked Up"
    ).length

  return (
    <div className="mobile-page">
      <SubPageHeader
        title={section}
        subtitle="Live Pickup Status"
        onBack={onBack}
      />

      <div className="mini-stats">
        <MiniStat
          number={waiting}
          label="Waiting"
          tone="warning"
        />

        <MiniStat
          number={arrived}
          label="Arrived"
          tone="blue"
        />

        <MiniStat
          number={picked}
          label="Picked Up"
          tone="success"
        />
      </div>

      <div className="student-status-list">
        {students.map((student) => (
          <div
            className="status-student-row static"
            key={student.id}
          >
            <Avatar
              initials={getInitials(
                student.name
              )}
              tone="soft"
            />

            <div>
              <strong>
                {student.name}
              </strong>

              <span>
                {student.grade}
              </span>
            </div>

            <StatusPill
              text={student.status}
              tone={statusTone(
                student.status
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   ADMIN APP
========================================================= */

function AdminApp({
  students,
  fetchers,
  fetcherRequests,
  pickupRecords,
  approveFetcherRequest,
  onLogout,
}) {
  const [screen, setScreen] =
    useState("dashboard")

  const pendingRequests =
    fetcherRequests.filter(
      (request) =>
        request.status === "Pending"
    )

  return (
    <RoleLayout
      bottomNav={
        <BottomNav
          items={[
            {
              key: "dashboard",
              label: "HOME",
              symbol: "⌂",
            },

            {
              key: "requests",
              label: "REQUESTS",
              symbol: "●",
            },

            {
              key: "records",
              label: "RECORDS",
              symbol: "▦",
            },

            {
              key: "settings",
              label: "SETTINGS",
              symbol: "⚙",
            },
          ]}
          active={screen}
          onChange={setScreen}
        />
      }
    >
      {screen === "dashboard" && (
        <div className="mobile-page">
          <AppHeader
            title="School Administration"
            subtitle="Ms. Ana Cruz • Administrator"
          />

          <div className="admin-stats">
            <MiniStat
              number={students.length}
              label="Students"
              tone="blue"
            />

            <MiniStat
              number={fetchers.length}
              label="Fetchers"
              tone="success"
            />

            <MiniStat
              number={
                pendingRequests.length
              }
              label="Pending"
              tone="warning"
            />
          </div>

          <div className="admin-module-list">
            <AdminModule
              title="User Accounts"
              description="Parents, teachers and personnel"
            />

            <AdminModule
              title="Students & Sections"
              description="Student records and class assignments"
            />

            <AdminModule
              title="Fetcher Requests"
              description={`${pendingRequests.length} pending request(s)`}
              onClick={() =>
                setScreen("requests")
              }
            />

            <AdminModule
              title="Pickup Records"
              description={`${pickupRecords.length} recorded transaction(s)`}
              onClick={() =>
                setScreen("records")
              }
            />

            <AdminModule
              title="SMS Logs"
              description="Pickup notification history"
            />
          </div>
        </div>
      )}

      {screen === "requests" && (
        <AdminFetcherRequests
          requests={fetcherRequests}
          students={students}
          onApprove={
            approveFetcherRequest
          }
        />
      )}

      {screen === "records" && (
        <AdminRecords
          records={pickupRecords}
        />
      )}

      {screen === "settings" && (
        <SettingsScreen
          role="School Administrator"
          onLogout={onLogout}
        />
      )}
    </RoleLayout>
  )
}

function AdminFetcherRequests({
  requests,
  students,
  onApprove,
}) {
  return (
    <div className="mobile-page">
      <AppHeader
        title="Fetcher Requests"
        subtitle="Administrator Approval"
      />

      <div className="stack-list">
        {requests.length === 0 && (
          <EmptyState
            text="No fetcher requests."
          />
        )}

        {requests.map((request) => {
          const student =
            students.find(
              (item) =>
                item.id ===
                request.studentId
            )

          return (
            <div
              className="admin-request-card"
              key={request.id}
            >
              <div className="request-person">
                <Avatar
                  initials={getInitials(
                    request.name
                  )}
                  tone="soft"
                />

                <div>
                  <strong>
                    {request.name}
                  </strong>

                  <span>
                    {
                      request.relationship
                    }
                  </span>
                </div>

                <StatusPill
                  text={
                    request.status
                  }
                  tone={
                    request.status ===
                    "Approved"
                      ? "success"
                      : "warning"
                  }
                />
              </div>

              <DataRow
                label="Student"
                value={
                  student?.name ||
                  "Unknown"
                }
              />

              <DataRow
                label="Requested By"
                value={
                  request.requestedBy
                }
              />

              <DataRow
                label="Contact"
                value={
                  request.contact
                }
              />

              {request.status ===
                "Pending" && (
                <div className="approval-actions">
                  <button
                    type="button"
                    className="mobile-success-button"
                    onClick={() =>
                      onApprove(
                        request.id
                      )
                    }
                  >
                    APPROVE FETCHER
                  </button>

                  <button
                    type="button"
                    className="mobile-danger-button"
                  >
                    REJECT
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AdminRecords({
  records,
}) {
  return (
    <div className="mobile-page">
      <AppHeader
        title="Pickup Records"
        subtitle="Transaction History"
      />

      <div className="stack-list">
        {records.map((record) => (
          <div
            className="small-record-card"
            key={record.id}
          >
            <div>
              <strong>
                {record.studentName}
              </strong>

              <span>
                {record.fetcherName}
              </span>
            </div>

            <div>
              <StatusPill
                text="COMPLETED"
                tone="success"
              />

              <small>
                {record.time}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   SHARED SCREENS
========================================================= */

function NotificationScreen({
  title,
  notifications,
}) {
  return (
    <div className="mobile-page">
      <AppHeader
        title={title}
        subtitle="SafePick Activity"
      />

      <div className="stack-list">
        {notifications.length ===
          0 && (
          <EmptyState
            text="No notifications yet."
          />
        )}

        {notifications.map(
          (notification) => (
            <div
              className="notification-card"
              key={notification.id}
            >
              <div className="notification-icon">
                ✓
              </div>

              <div>
                <strong>
                  {
                    notification.title
                  }
                </strong>

                <p>
                  {
                    notification.message
                  }
                </p>

                <span>
                  {notification.time}
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

function SettingsScreen({
  role,
  onLogout,
}) {
  return (
    <div className="mobile-page">
      <AppHeader
        title="Settings"
        subtitle={role}
      />

      <SettingGroup
        title="PROFILE"
        items={[
          "Account Information",
          role === "Teacher"
            ? "Assigned Classes"
            : "Profile Information",
        ]}
      />

      <SettingGroup
        title="SECURITY"
        items={[
          "Change Password",
          "App Security",
        ]}
      />

      <SettingGroup
        title="SYSTEM"
        items={[
          "Connection Status",
          "Help & Support",
          "Privacy & Data Use",
        ]}
      />

      <button
        type="button"
        className="logout-button"
        onClick={onLogout}
      >
        LOG OUT
      </button>
    </div>
  )
}

/* =========================================================
   REUSABLE UI
========================================================= */

function RoleLayout({
  children,
  bottomNav,
}) {
  return (
    <div className="role-layout">
      <div className="role-content">
        {children}
      </div>

      {bottomNav}
    </div>
  )
}

function PhoneStatusBar() {
  return (
    <div className="phone-statusbar">
      <span>
        4:30
      </span>

      <span>
        ● ● ▰
      </span>
    </div>
  )
}

function BottomNav({
  items,
  active,
  onChange,
}) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          type="button"
          key={item.key}
          className={
            active === item.key
              ? "active"
              : ""
          }
          onClick={() =>
            onChange(item.key)
          }
        >
          <span>
            {item.symbol}
          </span>

          <small>
            {item.label}
          </small>
        </button>
      ))}
    </nav>
  )
}

function AppHeader({
  title,
  subtitle,
}) {
  return (
    <div className="mobile-app-header">
      <div>
        <span className="eyebrow">
          SAFEPICK
        </span>

        <h2>
          {title}
        </h2>

        <p>
          {subtitle}
        </p>
      </div>

      <div className="small-logo">
        S
      </div>
    </div>
  )
}

function SubPageHeader({
  title,
  subtitle,
  onBack,
}) {
  return (
    <div className="subpage-header">
      <button
        type="button"
        onClick={onBack}
      >
        ←
      </button>

      <div>
        <h2>
          {title}
        </h2>

        <p>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function StatusPill({
  text,
  tone = "blue",
}) {
  return (
    <span
      className={`status-pill ${tone}`}
    >
      {text}
    </span>
  )
}

function Avatar({
  initials,
  tone = "blue",
  large = false,
  xlarge = false,
}) {
  return (
    <div
      className={[
        "avatar",
        tone,
        large ? "large" : "",
        xlarge ? "xlarge" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {initials}
    </div>
  )
}

function PersonCard({
  name,
  subtitle,
  status,
  tone,
}) {
  return (
    <div className="person-list-card">
      <Avatar
        initials={getInitials(name)}
        tone="soft"
      />

      <div>
        <strong>
          {name}
        </strong>

        <span>
          {subtitle}
        </span>
      </div>

      <StatusPill
        text={status}
        tone={tone}
      />
    </div>
  )
}

function PersonSummary({
  title,
  name,
  subtitle,
  initials,
}) {
  return (
    <div className="person-summary">
      <Avatar
        initials={initials}
        tone="blue"
        large
      />

      <div>
        <span>
          {title}
        </span>

        <strong>
          {name}
        </strong>

        <small>
          {subtitle}
        </small>
      </div>
    </div>
  )
}

function DataRow({
  label,
  value,
}) {
  return (
    <div className="data-row">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  )
}

function MiniStat({
  number,
  label,
  tone,
}) {
  return (
    <div
      className={`mini-stat ${tone}`}
    >
      <strong>
        {number}
      </strong>

      <span>
        {label}
      </span>
    </div>
  )
}

function SystemRow({
  label,
  value,
  tone,
}) {
  return (
    <div className="system-row">
      <span>
        {label}
      </span>

      <StatusPill
        text={value}
        tone={tone}
      />
    </div>
  )
}

function ClassCard({
  grade,
  section,
  students,
  onClick,
}) {
  return (
    <button
      type="button"
      className="class-card"
      onClick={onClick}
    >
      <span>
        {grade}
      </span>

      <strong>
        {section}
      </strong>

      <small>
        {students}
      </small>

      <b>
        VIEW PICKUP STATUS →
      </b>
    </button>
  )
}

function AdminModule({
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      className="admin-module"
      onClick={onClick}
    >
      <div>
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>

      <b>
        →
      </b>
    </button>
  )
}

function SettingGroup({
  title,
  items,
}) {
  return (
    <div className="setting-group">
      <span>
        {title}
      </span>

      {items.map((item) => (
        <button
          type="button"
          key={item}
        >
          {item}

          <b>
            →
          </b>
        </button>
      ))}
    </div>
  )
}

function CenteredState({
  icon,
  tone,
  eyebrow,
  title,
  description,
  buttonText,
  onButton,
  customButtons,
  customContent,
}) {
  return (
    <div className="centered-state">
      <div
        className={`state-icon ${tone}`}
      >
        {icon}
      </div>

      <span className="eyebrow">
        {eyebrow}
      </span>

      <h2>
        {title}
      </h2>

      <p>
        {description}
      </p>

      {customContent}

      {customButtons ? (
        <div className="button-stack">
          {customButtons}
        </div>
      ) : (
        <button
          type="button"
          className="mobile-primary-button"
          onClick={onButton}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}

function EmptyState({
  text,
}) {
  return (
    <div className="empty-state">
      {text}
    </div>
  )
}

function FakeQr() {
  const cells = useMemo(
    () =>
      Array.from(
        {
          length: 196,
        },
        (_, index) => {
          const row =
            Math.floor(index / 14)

          const col =
            index % 14

          const finder =
            (row < 5 &&
              col < 5) ||
            (row < 5 &&
              col > 8) ||
            (row > 8 &&
              col < 5)

          const pattern =
            (row * 7 +
              col * 5 +
              row * col) %
              8 <
            3

          return finder || pattern
        }
      ),
    []
  )

  return (
    <div
      className="fake-qr"
      aria-label="SafePick demo QR"
    >
      {cells.map(
        (filled, index) => (
          <span
            key={index}
            className={
              filled
                ? "filled"
                : ""
            }
          />
        )
      )}
    </div>
  )
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function statusTone(status) {
  if (
    status === "Picked Up"
  ) {
    return "success"
  }

  if (
    status ===
    "Fetcher Arrived"
  ) {
    return "blue"
  }

  return "warning"
}

export default App