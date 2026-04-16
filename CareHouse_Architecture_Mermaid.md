# CareHouse System Architecture - Mermaid Diagram

## System Overview

```mermaid
graph TB
    subgraph External["🌐 EXTERNAL NETWORK (Client Access Only)"]
        PC["👥 Patient Client"]
        AC["👥 Admin Client"]
        MC["👥 Medical Staff Client"]
    end

    subgraph Firewalls["🔐 PUBLIC GATEWAYS (Entry Points - Only Accessible from Outside)"]
        P0["🚪 Port 5000<br/>Patient Gateway<br/>JWT Auth"]
        A11["🚪 Port 5011<br/>Admin Gateway<br/>JWT Auth"]
        M6["🚪 Port 5006<br/>Medical Staff Gateway<br/>JWT Auth"]
    end

    subgraph PatientServer["🖥️ PATIENT SERVER (Internal Only)"]
        P1["📅 Port 5001<br/>Appointments"]
        P2["📁 Port 5002<br/>Medical Folders"]
        P3["👤 Port 5003<br/>Patient Service"]
        P4["📤 Port 5004<br/>File Service"]
        P5["📋 Port 5005<br/>Reports"]
    end

    subgraph AdminServer["🖥️ ADMIN SERVER (Internal Only)"]
        A10["🛠️ Port 5010<br/>Admin Service"]
    end

    subgraph MedicalServer["🖥️ MEDICAL STAFF SERVER (Internal Only)"]
        M7["🏥 Port 5007<br/>Staff Profiles"]
        M8["⏰ Port 5008<br/>Absences"]
        M9["✓ Port 5009<br/>Tasks"]
    end

    subgraph SharedDB["🗄️ SHARED DATABASE"]
        DB[("MongoDB")]
    end

    %% External Client to Gateway Connections (Only External Access)
    PC -->|Public HTTP/HTTPS| P0
    AC -->|Public HTTP/HTTPS| A11
    MC -->|Public HTTP/HTTPS| M6

    %% Gateway to Internal Services (Routing only)
    P0 -->|Internal| P1
    P0 -->|Internal| P2
    P0 -->|Internal| P3
    P0 -->|Internal| P4
    P0 -->|Internal| P5

    A11 -->|Internal| A10
    A11 -->|Internal Gateway Routing| P1
    A11 -->|Internal Gateway Routing| M7
    A11 -->|Internal Gateway Routing| M9

    M6 -->|Internal| M7
    M6 -->|Internal| M8
    M6 -->|Internal| M9
    M6 -->|Internal Gateway Routing| P1
    M6 -->|Internal Gateway Routing| P2
    M6 -->|Internal Gateway Routing| P3
    M6 -->|Internal Gateway Routing| P4
    M6 -->|Internal Gateway Routing| P5

    %% Internal Service Communications (Same Server)
    P1 -.->|Internal Server Comm| P3
    P2 -.->|Internal Server Comm| P3
    P5 -.->|Internal Server Comm| P3

    M9 -.->|Internal Server Comm| M7
    M8 -.->|Internal Server Comm| M7

    %% Service to Database
    P1 --> DB
    P2 --> DB
    P3 --> DB
    P4 --> DB
    P5 --> DB
    A10 --> DB
    M7 --> DB
    M8 --> DB
    M9 --> DB

    %% Styling
    style External fill:#0277BD,stroke:#01579B,color:#fff,stroke-width:3px
    style Firewalls fill:#D32F2F,stroke:#B71C1C,color:#fff,stroke-width:3px
    style PatientServer fill:#C5E1A5,stroke:#558B2F,stroke-width:2px
    style AdminServer fill:#F8BBD0,stroke:#C2185B,stroke-width:2px
    style MedicalServer fill:#A1887F,stroke:#4E342E,stroke-width:2px,color:#fff
    style SharedDB fill:#FFE082,stroke:#F57F17,stroke-width:2px
    style DB fill:#FB8C00,color:#fff
```

---

## Task Completion Cascading Flow

```mermaid
sequenceDiagram
    participant MS as 👨‍⚕️ Medical Staff
    participant M6 as 🚪 Port 5006<br/>Gateway
    participant M9 as ✓ Port 5009<br/>Tasks Service
    participant P1 as 📅 Port 5001<br/>Appointments
    participant M7 as 🏥 Port 5007<br/>Staff Service
    participant P3 as 👤 Port 5003<br/>Patient Service
    
    MS->>M6: PUT /api/tasks/:id<br/>(mark complete)
    activate M6
    M6->>M6: ✅ Verify JWT<br/>Validate Token
    M6->>M9: Route request
    deactivate M6
    
    activate M9
    M9->>M9: ✅ Update task status
    M9->>M9: 📝 DELETE task record
    
    par Internal Server Comms
        M9->>P1: 🔗 DELETE /api/appointments/:id
        activate P1
        P1->>P1: ✅ Remove appointment
        deactivate P1
        
        M9->>M7: 🔗 GET /api/doctors/:id
        activate M7
        M7->>M7: ✅ Build new tasks[]<br/>(filter out task)
        M7->>M7: 📝 PUT /api/doctors/:id
        deactivate M7
        
        M9->>P3: 🔗 GET /api/patients/:id
        activate P3
        P3->>P3: ✅ Remove from appointments[]
        P3->>P3: 📝 PUT /api/patients/:id
        deactivate P3
    end
    
    M9-->>MS: ✅ 200 OK<br/>Task Completed Successfully
    deactivate M9
```

---

## Patient Registration & Login Flow

```mermaid
sequenceDiagram
    participant Client as 👥 Patient Client
    participant P0 as 🚪 Port 5000<br/>Patient Gateway
    participant P3 as 👤 Port 5003<br/>Patient Service
    participant DB as 🗄️ MongoDB
    
    rect rgb(0, 128, 0, 0.1)
    Note over Client,DB: REGISTRATION FLOW
    Client->>P0: POST /auth/register<br/>(email, password, details)
    activate P0
    P0->>P0: 🔐 Hash password<br/>Generate salt
    P0->>P3: Forward registration
    activate P3
    P3->>DB: Check email uniqueness
    activate DB
    DB-->>P3: ✅ Email available
    deactivate DB
    P3->>DB: Create patient record<br/>(hashed password)
    activate DB
    DB-->>P3: ✅ Patient created<br/>(_id returned)
    deactivate DB
    P3-->>P0: Return patient object
    deactivate P3
    P0-->>Client: 201 Created<br/>(patient data, no tokens)
    deactivate P0
    end
    
    rect rgb(0, 0, 255, 0.1)
    Note over Client,DB: LOGIN FLOW
    Client->>P0: POST /auth/login<br/>(email, password)
    activate P0
    P0->>P3: Query by email
    activate P3
    P3->>DB: find({email})
    activate DB
    DB-->>P3: ✅ Patient found
    deactivate DB
    deactivate P3
    P0->>P0: 🔐 Compare passwords<br/>with bcrypt
    alt ✅ Passwords Match
        P0->>P0: 🔑 Generate accessToken<br/>(JWT - 10 min expiry)
        P0->>P0: 🔑 Generate refreshToken<br/>(JWT - 24 hrs expiry)
        P0->>P3: Save refreshToken to array
        activate P3
        P3->>DB: Update patient tokens[]
        activate DB
        DB-->>P3: ✅ Tokens saved
        deactivate DB
        deactivate P3
        P0-->>Client: 200 OK<br/>(accessToken, refreshToken)
    else ❌ Passwords Don't Match
        P0-->>Client: 401 Unauthorized<br/>(Invalid credentials)
    end
    deactivate P0
    end
```

---

## Appointment Creation & Task Assignment

```mermaid
sequenceDiagram
    participant Admin as 👨‍💼 Admin
    participant A11 as 🚪 Port 5011<br/>Admin Gateway
    participant P1 as 📅 Port 5001<br/>Appointments
    participant P3 as 👤 Port 5003<br/>Patient Service
    participant M9 as ✓ Port 5009<br/>Tasks
    participant M7 as 🏥 Port 5007<br/>Staff Service
    participant DB as 🗄️ MongoDB
    
    Admin->>A11: POST /api/appointments<br/>(patient_id, type, doctor_id)
    activate A11
    A11->>A11: ✅ Verify JWT<br/>Validate authorization
    A11->>P1: Route to Appointments Service
    activate P1
    
    P1->>P3: Verify patient exists
    activate P3
    P3->>DB: find({_id: patient_id})
    activate DB
    DB-->>P3: ✅ Patient found
    deactivate DB
    P3-->>P1: ✅ Patient verified
    deactivate P3
    
    P1->>DB: Create appointment record
    activate DB
    DB-->>P1: ✅ Appointment created<br/>(appointment_id)
    deactivate DB
    
    P1->>M9: Create correlated task
    activate M9
    M9->>M7: Link task to doctor
    activate M7
    M7->>DB: find({_id: doctor_id})
    activate DB
    DB-->>M7: ✅ Doctor found
    deactivate DB
    M7->>M7: Update doctor.tasks[]<br/>(add new task_id)
    M7->>DB: Save updated doctor
    deactivate M7
    M9-->>P1: ✅ Task created & linked
    deactivate M9
    
    P1-->>A11: 201 Created<br/>(appointment_details)
    deactivate P1
    A11-->>Admin: 201 Created<br/>(appointment_id, task_id)
    deactivate A11
```

---

## Medical Folder Download Flow

```mermaid
graph LR
    A["👨‍⚕️ Medical Staff<br/>(Port 5006)"] -->|GET /patients/:id/folder| B["🚪 Port 5006<br/>Medical Gateway"]
    B -->|Verify JWT<br/>Check permissions| B
    B -->|Forward request| C["👤 Port 5003<br/>Patient Service"]
    C -->|Query patient| D["🗄️ MongoDB"]
    D -->|medical_folder_id| C
    C -->|Return folder_id| B
    B -->|Forward request| E["📁 Port 5002<br/>Medical Folder Service"]
    E -->|Query folder| F["🗄️ MongoDB"]
    F -->|file_id from folder| E
    E -->|Return to gateway| B
    B -->|Request file download| G["📤 Port 5004<br/>File Service<br/>GridFS Storage"]
    G -->|Stream PDF file| B
    B -->|PDF chunked stream| A
    
    style A fill:#e8f5e9,stroke:#2E7D32,stroke-width:2px
    style B fill:#FF6F00,stroke:#E65100,color:#fff,stroke-width:2px
    style C fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style D fill:#FFB74D,stroke:#F57F17,stroke-width:2px
    style E fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style F fill:#FFB74D,stroke:#F57F17,stroke-width:2px
    style G fill:#FFB74D,stroke:#F57F17,stroke-width:2px
```

---

## File Upload to GridFS

```mermaid
graph TD
    A["👨‍⚕️ Admin/Staff<br/>POST /api/upload/image<br/>multipart/form-data"] --> B["🚪 Port 5011/5006<br/>Gateway"]
    B -->|Verify JWT<br/>Route request| C["📤 Port 5004<br/>File Service<br/>GridFS Handler"]
    
    C --> D["🔍 Parse multipart<br/>Extract file data"]
    D --> E["⚙️ Validate file<br/>- Type check<br/>- Size limit<br/>- MIME verify"]
    E --> F{"✓ File Valid?"}
    
    F -->|❌ No| G["❌ 400 Bad Request<br/>Error: Invalid file"]
    G --> H["Return error message"]
    H --> B
    B --> A
    
    F -->|✅ Yes| I["💾 MongoDB GridFS<br/>Store in 'images' bucket"]
    I --> J["🔑 Generate file_id<br/>(ObjectId)"]
    J --> K["📝 Update document<br/>with file_id reference"]
    K --> L["📋 Store metadata<br/>(filename, mimetype,<br/>uploadDate, size)"]
    L --> M["✅ 201 Created<br/>Return file_id"]
    M --> B
    B --> A
    
    style A fill:#e8f5e9,stroke:#2E7D32,stroke-width:2px
    style B fill:#FF6F00,stroke:#E65100,color:#fff,stroke-width:2px
    style C fill:#FFB74D,stroke:#F57F17,stroke-width:2px
    style I fill:#FFB74D,stroke:#F57F17,stroke-width:2px
    style M fill:#c8e6c9,stroke:#2E7D32,stroke-width:2px
    style G fill:#ffcdd2,stroke:#C62828,stroke-width:2px
    style H fill:#ffcdd2,stroke:#C62828,stroke-width:2px
```

---

## Inter-Service Communication Matrix (Access Control)

```mermaid
graph TB
    subgraph PublicGateways["🔐 PUBLIC GATEWAYS (External Access Only)"]
        S5000["🚪 Port 5000<br/>Patient Gateway"]
        S5006["🚪 Port 5006<br/>Medical Staff Gateway"]
        S5011["🚪 Port 5011<br/>Admin Gateway"]
    end

    subgraph PatientServices["🖥️ PATIENT SERVER (Port 5001-5005)"]
        S5001["📅 5001: Appointments"]
        S5002["📁 5002: Medical Folders"]
        S5003["👤 5003: Patient Service"]
        S5004["📤 5004: File Service<br/>(GridFS)"]
        S5005["📋 5005: Reports"]
    end

    subgraph AdminServices["🖥️ ADMIN SERVER (Port 5010)"]
        S5010["🛠️ 5010: Admin Service"]
    end

    subgraph MedicalServices["🖥️ MEDICAL SERVER (Port 5007-5009)"]
        S5007["🏥 5007: Staff Profiles"]
        S5008["⏰ 5008: Absences"]
        S5009["✓ 5009: Tasks"]
    end

    %% PATIENT GATEWAY ROUTING
    S5000 -->|Route & Authenticate| S5001
    S5000 -->|Route & Authenticate| S5002
    S5000 -->|Route & Authenticate| S5003
    S5000 -->|Route & Authenticate| S5004
    S5000 -->|Route & Authenticate| S5005

    %% ADMIN GATEWAY ROUTING
    S5011 -->|Route & Authenticate| S5010
    S5011 -->|Route & Authenticate| S5001
    S5011 -->|Route & Authenticate| S5007
    S5011 -->|Route & Authenticate| S5009

    %% MEDICAL STAFF GATEWAY ROUTING
    S5006 -->|Route & Authenticate| S5007
    S5006 -->|Route & Authenticate| S5008
    S5006 -->|Route & Authenticate| S5009
    S5006 -->|Route & Authenticate| S5001
    S5006 -->|Route & Authenticate| S5002
    S5006 -->|Route & Authenticate| S5003
    S5006 -->|Route & Authenticate| S5004
    S5006 -->|Route & Authenticate| S5005

    %% INTERNAL SERVICE COMMS - Patient Server
    S5001 -.->|Internal Query| S5003
    S5002 -.->|Internal Query| S5003
    S5005 -.->|Internal Link| S5003
    
    %% INTERNAL SERVICE COMMS - Medical Server
    S5009 -.->|Internal Update| S5007
    S5008 -.->|Internal Query| S5007

    %% CROSS-SERVER COMMS (via Gateways)
    S5009 -->|Cross-Server via Gateway| S5001
    S5009 -->|Cross-Server via Gateway| S5003

    %% Styling
    style PublicGateways fill:#D32F2F,stroke:#B71C1C,color:#fff,stroke-width:3px
    style PatientServices fill:#C5E1A5,stroke:#558B2F,stroke-width:2px
    style AdminServices fill:#F8BBD0,stroke:#C2185B,stroke-width:2px
    style MedicalServices fill:#A1887F,stroke:#4E342E,stroke-width:2px,color:#fff

    style S5000 fill:#FF6E40,color:#fff
    style S5006 fill:#FF6E40,color:#fff
    style S5011 fill:#FF6E40,color:#fff
    style S5001 fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style S5002 fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style S5003 fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style S5004 fill:#FFB74D
    style S5005 fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style S5007 fill:#B1A692,stroke:#4E342E,stroke-width:2px,color:#fff
    style S5008 fill:#B1A692,stroke:#4E342E,stroke-width:2px,color:#fff
    style S5009 fill:#B1A692,stroke:#4E342E,stroke-width:2px,color:#fff
    style S5010 fill:#EC407A,stroke:#C2185B,stroke-width:2px
```

---

## 🔒 Network Access & Security Policy

```mermaid
graph LR
    subgraph External["🌍 EXTERNAL NETWORK"]
        WAN["Internet Users<br/>(Patients, Admins,<br/>Medical Staff)"]
    end

    subgraph DMZ["🛡️ DMZ - FIREWALL PROTECTED"]
        direction LR
        GW1["🚪 Port 5000<br/>Patient Gateway"]
        GW2["🚪 Port 5006<br/>Med Staff Gateway"]
        GW3["🚪 Port 5011<br/>Admin Gateway"]
    end

    subgraph Internal["🔐 PRIVATE INTERNAL NETWORK"]
        subgraph PS["Patient Server<br/>Ports: 5001-5005"]
            direction LR
            S1["5001"]
            S2["5002"]
            S3["5003"]
            S4["5004"]
            S5["5005"]
        end
        subgraph AS["Admin Server<br/>Port: 5010"]
            direction LR
            S10["5010"]
        end
        subgraph MS["Medical Server<br/>Ports: 5007-5009"]
            direction LR
            S7["5007"]
            S8["5008"]
            S9["5009"]
        end
        subgraph DB["Database Layer"]
            direction LR
            MONGO["MongoDB"]
        end
    end

    WAN -->|✅ Public HTTPS<br/>JWT Auth| GW1
    WAN -->|✅ Public HTTPS<br/>JWT Auth| GW2
    WAN -->|✅ Public HTTPS<br/>JWT Auth| GW3
    
    GW1 -->|✅ Internal Routing| PS
    GW2 -->|✅ Internal Routing| MS
    GW2 -->|✅ Internal Routing| PS
    GW3 -->|✅ Internal Routing| AS
    GW3 -->|✅ Internal Routing| PS
    GW3 -->|✅ Internal Routing| MS
    
    PS -->|✅ Internal Comm| DB
    AS -->|✅ Internal Comm| DB
    MS -->|✅ Internal Comm| DB
    
    S1 -.->|⚠️ Limited Internal| S3
    S2 -.->|⚠️ Limited Internal| S3
    S7 -.->|⚠️ Limited Internal| S9
    S8 -.->|⚠️ Limited Internal| S7

    style External fill:#0277BD,stroke:#01579B,color:#fff,stroke-width:2px
    style DMZ fill:#FF6F00,stroke:#E65100,color:#fff,stroke-width:3px
    style Internal fill:#1B5E20,stroke:#0D47A1,color:#fff,stroke-width:3px
    style PS fill:#C5E1A5,stroke:#558B2F,stroke-width:2px,color:#000
    style AS fill:#F8BBD0,stroke:#C2185B,stroke-width:2px,color:#000
    style MS fill:#BCAAA4,stroke:#4E342E,stroke-width:2px,color:#fff
    style DB fill:#FFE082,stroke:#F57F17,stroke-width:2px,color:#000
    style WAN fill:#0288D1,color:#fff
    style GW1 fill:#F4511E,color:#fff
    style GW2 fill:#F4511E,color:#fff
    style GW3 fill:#F4511E,color:#fff
```

---

**Legend:**
- ✅ **Green flows** = Allowed communication
- 📍 **Public Gateways** = Only services exposed to clients
- 🔒 **Private Services** = Only accessible via their dedicated gateway
- ⚠️ **Limited Internal** = Services can communicate only within same server
- 🛡️ **Firewall** = External traffic must pass through gateways

---

## License
apache-2.0 License
