# **USER REQUIREMENTS SPECIFICATION** 

## **JKN RiskGraph** 

_Graph Analytics-Based Risk Intelligence Platform_ 

For BPJS Kesehatan Healthcare Fraud Detection 

Version 1.0 

September 2026 

Healthkathon 2026 

### **Document Control** 

|**Document Title**|**User Requirements Specification - JKN**|
|---|---|
||**RiskGraph **|
|**Version**|1.0|
|**Date**|September 1,2026|
|**Status**|Draft|
|**Classification**|Internal Use|



#### **Revision History** 

|**Version**|**Date**|**Author**|**Changes**|
|---|---|---|---|
|**1.0**|2026-09-01|Project Team|Initial draft - MVP<br>requirements|



### **Executive Summary** 

JKN RiskGraph is a next-generation risk intelligence platform designed to transform how BPJS Kesehatan detects and investigates potential fraud, waste, and abuse in the JKN (Jaminan Kesehatan Nasional) healthcare program. Unlike traditional transaction-based screening systems, JKN RiskGraph employs graph analytics and artificial intelligence to identify suspicious patterns by analyzing relationships and networks among participants, healthcare providers, doctors, pharmacies, and claims. 

#### **Core Innovation** 

The fundamental insight driving JKN RiskGraph is that fraud and abuse often appear as abnormal relationships rather than abnormal transactions. A single claim may look legitimate in isolation, but when viewed within the context of referral patterns, pharmacy dispensing behavior, patient clustering, and provider networks, hidden risks emerge. The platform constructs a heterogeneous healthcare graph connecting all entities and uses multi-layered analytics—rule engines, statistical anomaly detection, graph algorithms, and machine learning—to surface high-risk networks for human investigation. 

#### **Key Capabilities** 

- Network-level risk detection: Identifies suspicious clusters, communities, and motifs across millions of claims 

- Multi-risk detection: Detects cloning, repeat billing, referral concentration, upcoding, prolonged LOS, phantom billing, and pharmacy anomalies within a unified framework 

- Explainable AI: Provides transparent risk scoring with clear breakdown of contributing factors 

- Human-in-the-loop investigation: Prioritizes cases for investigator review without automating fraud determination 

- Adaptive learning: Incorporates investigator feedback to continuously improve detection accuracy 

### **1. Introduction** 

#### **1.1 Purpose** 

This User Requirements Specification (URS) document defines the functional and nonfunctional requirements for the JKN RiskGraph system. The document is intended to serve as the authoritative source of user needs and system behavior for the development team, stakeholders, and quality assurance personnel. 

#### **1.2 Scope** 

This URS covers the Minimum Viable Product (MVP) of JKN RiskGraph, focusing on core capabilities required to demonstrate the value of network-based risk intelligence. 

#### **1.3 Definitions and Acronyms** 

|**Term**|**Definition**|
|---|---|
|**BPJS**|Badan Penyelenggara Jaminan Sosial<br>(Social SecurityAdministrator)|
|**JKN**|Jaminan Kesehatan Nasional (National<br>Health Insurance)|
|**URS**|User Requirements Specification|
|**MVP**|Minimum Viable Product|
|**GNN**|Graph Neural Network|
|**AI**|Artificial Intelligence|



#### **1.4 References** 

- JKN RiskGraph - Summary Konsep (Concept Document) 

- BPJS Kesehatan Healthkathon 2026 Challenge Brief 

- Muhammad, R., Tbaishat, D., Nazir, A., Yacoub, S., AbdulRazek, M., Abo El-Enen, M.A., & Sahlol, A.T. (2025). Fraud detection and explanation in medical claims using GNN architectures. Scientific Reports, 15. https://doi.org/10.1038/s41598-025-22910-6 

- ISO/IEC 25010:2011 - Systems and software Quality Requirements and Evaluation (SQuaRE) 

### **2. System Overview** 

#### **2.1 System Context** 

JKN RiskGraph operates within the broader ecosystem of BPJS Kesehatan's Program JKN, which processes millions of healthcare claims annually from thousands of providers serving tens of millions of participants. The system receives data from existing JKN data sources and provides risk intelligence outputs to BPJS investigation teams. 

#### **2.2 System Objectives** 

##### **Primary Objectives:** 

- Enable investigators to identify high-risk networks that would be missed by transaction-level screening 

- Reduce investigation workload by prioritizing the most suspicious cases 

- Provide explainable risk scores so investigators understand why a network is flagged 

- Support multiple risk scenario detection within a unified platform 

- Establish a feedback loop that improves detection accuracy over time 

#### **2.3 Key Assumptions and Constraints** 

##### **Assumptions:** 

- Historical claims data covering at least 12 months will be available for graph construction 

- Participant, provider, and doctor master data exists with reasonably consistent identifiers 

- Investigation team members have basic familiarity with risk concepts and healthcare fraud patterns 

- The system will be used for retrospective investigation, not real-time claim screening 

- Human investigators make final fraud determination decisions, not the system 

**Constraints:** 

- MVP must be delivered within Healthkathon 2026 timeline 

- System must handle graphs with millions of nodes and tens of millions of edges 

- All personally identifiable information (PII) must be protected according to Indonesian data privacy regulations 

- The system must provide explainable results (not black-box AI) 

- Graph analytics processing should complete within acceptable timeframes for batch analysis 

### **3. User Roles and Characteristics** 

#### **3.1 User Role Definitions** 

The JKN RiskGraph system supports six primary user roles, each with distinct responsibilities and system access requirements. 

**Role 1: Risk Investigator/Auditor** 

|**Description**|**Primary end user responsible for reviewing**<br>**flagged networks, analyzing risk signals,**<br>**conducting investigations, and making**<br>**recommendations for audit or enforcement**<br>**action**|
|---|---|
|**Primary Goals**|Efficiently identify which networks warrant<br>detailed investigation; Understand why a<br>network has been flagged as high-risk;<br>Access supporting evidence; Document<br>investigation findings|
|**Key Activities**|Review priority queue of high-risk<br>networks; Drill into network visualizations;<br>Examine risk signal explanations; Compare<br>network behavior againstpeer benchmarks|
|**Technical Proficiency**|Moderate - comfortable with dashboards,<br>data visualizations, and basic analytical<br>concepts|
|**Domain Expertise**|High - deep understanding of healthcare<br>fraud patterns, JKN policies, billing codes,<br>and investigationprocedures|
|**Access Level**|Full access to investigation dashboard,<br>network details, claim data, and risk<br>explanations|



##### **Role 2: Risk Analyst** 

Analytical specialist responsible for deeper pattern analysis, risk model validation, peer group definition, and trend identification across the system. 

##### **Role 3: Data Manager** 

Technical specialist responsible for data ingestion, quality assurance, entity resolution, and ensuring the healthcare graph accurately represents the underlying data. 

##### **Role 4: System Administrator** 

IT professional responsible for system configuration, user management, security, performance monitoring, and technical operations. 

##### **Role 5: Supervisor/Investigation Manager** 

Management role responsible for overseeing investigation team, reviewing investigation outcomes, making final decisions on audit actions, and ensuring investigation quality. 

**Role 6: Executive/Director** 

Senior leadership role focused on strategic oversight, program performance assessment, and resource allocation decisions. 

### **4. Functional Requirements** 

This section defines the functional requirements for the JKN RiskGraph MVP, organized by major capability area. 

#### **4.1 Data Management** 

The system shall ingest and process claims, participant, provider, and doctor data with validation, entity resolution, and quality assurance. 

#### **4.2 Graph Construction and Analytics** 

The system shall construct a heterogeneous healthcare graph and apply graph algorithms including centrality analysis, community detection, and motif detection. 

#### **4.3 Risk Detection and Scoring** 

The system shall implement multi-layered risk detection using rule engines, statistical anomaly detection, graph analytics, and machine learning to produce explainable risk scores. 

#### **4.4 Investigation Management** 

The system shall provide investigation workflow, case assignment, investigator actions, feedback capture, and decision tracking. 

#### **4.5 Reporting and Visualization** 

The system shall provide dashboards, network visualization, risk explanation displays, trend reports, and export capabilities. 

#### **4.6 User Management and Administration** 

The system shall provide user authentication, role-based access control, audit logging, system configuration, and administrative functions. 

### **5. Non-Functional Requirements** 

#### **5.1 Performance** 

- Graph construction from 12 months of claims data shall complete within 24 hours 

- Risk scoring across all networks shall complete within 4 hours of graph construction 

- Investigation dashboard pages shall load within 3 seconds under normal load 

- Network visualization with up to 500 nodes shall render within 5 seconds 

- The system shall support at least 20 concurrent users without performance degradation 

#### **5.2 Security** 

- All user authentication shall use secure protocols (OAuth 2.0, SAML, or equivalent) 

- All data transmission shall be encrypted using TLS 1.2 or higher 

- Personally identifiable information shall be encrypted at rest using AES-256 

- Role-based access control shall enforce separation of duties between roles 

- The system shall maintain comprehensive audit logs of all user actions 

#### **5.3 Usability** 

- The interface shall be accessible via modern web browsers without plugins 

- Risk Investigators shall be able to complete basic investigation tasks with less than 2 hours of training 

- The interface shall provide contextual help and tooltips for all complex features 

- Error messages shall be clear, actionable, and in Indonesian language 

### **7. Acceptance Criteria** 

The MVP shall be considered complete when: 

- All P0 and P1 requirements are implemented and tested 

- The system successfully processes 12 months of historical claims data 

- Risk Investigators can identify, review, and act on high-risk networks 

- All five priority risk scenarios (cloning, repeat billing, referral concentration, provider anomaly, prolonged LOS) produce explainable risk scores 

- User acceptance testing demonstrates usability for target user roles 

- System meets all non-functional requirements for MVP 

### **8. Future Enhancements** 

Post-MVP enhancements to be prioritized based on MVP learnings: 

- Pharmacy and prescription network analysis 

- Graph Neural Network models for advanced pattern detection 

- Real-time claim screening and alerting 

- Integration with case management and enforcement systems 

- Mobile application for field investigators 

- Predictive analytics for proactive risk identification 

