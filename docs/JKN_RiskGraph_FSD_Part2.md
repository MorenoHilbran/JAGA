# **FUNCTIONAL SPECIFICATION DOCUMENT - PART 2** 

## **JKN RiskGraph** 

_User Workflows, AI Integration, and System Flows_ 

Version 1.0 

### **4. User Role Workflows and Scenarios** 

This section details the specific workflows, screens, and interactions each user role will experience when using JKN RiskGraph. Each workflow describes the step-by-step process users follow to accomplish their primary tasks, including how AI assists them at each stage. 

#### **4.1 Risk Investigator/Auditor Workflows** 

Risk Investigators are the primary end users of JKN RiskGraph. Their workflows center around reviewing AI-flagged high-risk networks, understanding why they were flagged, examining supporting evidence, and making investigation decisions. The system prioritizes their time by surfacing the most suspicious networks first and providing rich context to accelerate decision-making. 

##### **Workflow 1: Morning Investigation Queue Review** 

Purpose: Start the day by reviewing newly detected high-risk networks and prioritizing investigation efforts. 

Frequency: Daily 

AI Assistance: Automated risk detection, prioritization, and overnight processing 

1. Login and Dashboard Access: Investigator logs into JKN RiskGraph and lands on their personal investigation dashboard. 

2. View Priority Queue (AI-Generated): The dashboard displays a Priority Investigation Queue showing the top 20 highest-risk networks detected since the last session. Each entry shows: Network ID, Risk Score (0-100 with color coding), Primary Risk Type (Referral Concentration, Cloning, etc.), Financial Impact (total claim amount involved), Entity Count (how many providers/doctors/patients in network), and Detection Date. 

3. AI-Assisted Filtering: Investigator can filter the queue by risk type, region, provider type, or minimum financial impact. The AI automatically suggests filters based on the investigator's recent focus areas and historical investigation patterns. 

4. Quick Triage: For each network in the queue, the investigator can see an AI-generated one-line summary explaining why it was flagged. Example: "Network #1027: High referral concentration (82%) from 3 doctors to Hospital X, with suspicious claim similarity (87%) across 42 cases." 

5. Select Network for Investigation: Investigator clicks on a network to drill into detailed investigation view. The system logs this action and moves the network from "queued" to "under investigation" status. 

6. AI tracks time spent: The system silently tracks how long the investigator spends on each network to help prioritize future queues (networks dismissed quickly may indicate lower relevance). 

##### **Workflow 2: Detailed Network Investigation** 

Purpose: Understand why a network was flagged, examine evidence, and decide whether to escalate or dismiss. 

Frequency: Multiple times daily 

AI Assistance: Explainable risk scoring, evidence aggregation, peer comparison, visual network representation 

1. Network Overview Panel: Upon selecting a network, the investigator sees a comprehensive overview including: Network ID and alias (e.g., "Provider X Referral Network"), Risk Score breakdown showing contribution from each detection method (Rule Engine +24, Statistical Anomaly +21, Graph Analytics +19, ML Model +15), Key Entities involved (providers, doctors, patients, pharmacies), Time Period of suspicious activity, and Total Financial Impact. 

2. AI-Generated Risk Explanation: The system displays a plain-language explanation of why this network scored high. Example: "This network exhibits three concerning patterns: (1) Dr. Ahmad, Dr. Budi, and Dr. Siti refer 82% of their patients to Hospital X, compared to 34% peer average. (2) Claims from 42 patients show 87% similarity in diagnosis codes, procedure codes, and claim amounts, suggesting potential cloning. (3) Hospital X performs Procedure Code ABC at 4.1× the rate of peer hospitals, indicating possible upcoding or overutilization." 

3. Interactive Network Visualization (AI-Enhanced): A graph visualization shows entities as nodes and relationships as edges. The AI highlights suspicious patterns in red/orange: thick edges between doctors and the provider (high referral volume), clusters of patients with similar claim patterns, and paths showing referral chains. The investigator can click nodes to see entity details, hover over edges to see relationship metrics, zoom and pan to explore the network, and collapse/expand sections to focus on specific patterns. 

4. Peer Comparison Dashboard: For each key entity, the system shows how it compares to its peer group. Example for Hospital X: Average Claim Amount: Rp 7.2M (peer median: Rp 4.8M, 3.2σ above), Procedure ABC Frequency: 48% (peer median: 12%, 4.1× higher), Length of Stay for Diagnosis Y: 6.2 days (peer median: 3.1 days, 2.8σ above). The AI highlights which deviations are statistically significant and most concerning. 

5. Claim Drill-Down: The investigator can drill into individual claims within the network. Claims are sorted by similarity to potential fraud patterns. For each claim, the system shows: Participant details (anonymized), Provider and doctor, Diagnosis and procedure codes, Claim amount and length of stay, Similarity score to other claims in network (AIcalculated), and Red flags (highlighted by rules/models). 

6. Evidence Timeline (AI-Aggregated): A timeline view shows when suspicious activity occurred and how it evolved over time. The AI identifies if the activity is: Isolated incident (short spike), Ongoing pattern (consistent over months), Escalating trend (increasing frequency/severity). This helps investigators understand if the issue is active and growing. 

7. AI Investigation Assistant (Optional): Investigators can ask questions about the network in natural language. Example questions: "Why is the referral rate suspicious?", "Are there 

similar networks I should look at?", "What is the financial impact if all these claims are fraudulent?" The AI retrieves relevant data and provides contextual answers. 

8. Decision and Action: After reviewing evidence, the investigator selects an action: Confirm Risk & Escalate to Audit (network moves to supervisor queue for final approval), Need More Evidence (network marked for follow-up, investigator can add notes on what additional information is needed), or Dismiss as False Positive (network removed from queue, investigator provides reason for dismissal to improve future detection). 

9. Feedback Capture (AI Learning): When the investigator makes a decision, the system captures feedback: Was the risk score accurate? (Yes/No), Were the explanations helpful? (Yes/No/Partially), What risk signals were most convincing? (Checkboxes for rule types, statistical deviations, graph patterns, ML score). This feedback is used to retrain models and adjust risk scoring weights. 

**Workflow 3: Case Documentation and Handoff** 

Purpose: Document investigation findings and hand off confirmed risks to supervisors or audit teams. 

Frequency: After each confirmed risk case 

AI Assistance: Auto-generated investigation briefs, evidence compilation 

1. Generate Investigation Brief (AI-Powered): When the investigator confirms a risk and escalates to audit, the system automatically generates an investigation brief including: Network summary (entities involved, time period, financial impact), Risk signals detected (detailed breakdown of what triggered each detection method), Evidence summary (key claims, peer comparisons, anomalous patterns), Investigator notes and recommendations, and Confidence assessment (High/Medium/Low based on evidence strength). 

2. Attach Supporting Evidence: The system automatically attaches: Network visualization diagram (as PDF), Claims data export (Excel file with flagged claims), Peer comparison charts (showing statistical deviations), and Timeline of suspicious activity. 

3. Route to Supervisor: The brief is automatically routed to the investigator's supervisor for review. The supervisor receives an email/system notification. 

4. Track Investigation Status: The investigator can track the status of escalated cases: Under Supervisor Review, Approved for Audit, Audit in Progress, Audit Complete - Confirmed, or Audit Complete - Dismissed. 

5. Close Loop with Feedback: When audits are completed, the final outcome (confirmed fraud, legitimate but unusual, dismissed) is fed back to the risk detection engine to improve future accuracy. 

#### **4.2 Risk Analyst Workflows** 

Risk Analysts operate at a higher analytical level, focusing on aggregate patterns, model performance, and system tuning. They use advanced analytical capabilities to identify emerging fraud schemes, validate detection accuracy, and recommend system improvements. The AI assists them by providing rich analytics and pattern detection. 

##### **Workflow 4: Weekly Risk Pattern Analysis** 

1. Access Analytics Workbench: Risk Analyst logs into the Analytics Workbench, a more technical interface with advanced querying and visualization tools. 

2. Review Risk Trend Dashboard (AI-Generated): The dashboard shows trends over the past week/month/quarter: Total risks detected by type (line chart over time), Risk score distribution (histogram showing if scores are well-calibrated), Investigation outcomes (confirmed vs dismissed rates), Financial impact trends (total amounts at risk by time period), and Geographic hotspots (map showing concentration of risks by region). 

3. Identify Emerging Patterns (AI-Assisted): The AI highlights anomalous trends that warrant attention. Example: "ALERT: Referral concentration risks have increased 38% in Region X over the past 30 days, with 12 new networks detected. This may indicate an emerging coordinated scheme." The analyst can drill into these alerts to investigate the underlying networks. 

4. Analyze False Positive Patterns: The analyst reviews risks that were flagged but dismissed by investigators. The AI groups dismissals by reason and highlights: Detection rules with highest false positive rates, Peer groups that may be mis-calibrated, Risk types that investigators consistently dismiss. This analysis informs rule refinement and model retraining. 

5. Model Performance Review: The analyst reviews ML model performance metrics: Precision (% of flagged risks that were confirmed), Recall (% of confirmed risks that were flagged), F-score and AUC-ROC curves, Feature importance rankings (which graph/statistical features are most predictive), and Model drift indicators (is performance degrading over time?). 

6. Recommend System Tuning: Based on analysis, the analyst recommends: Adjusting risk score thresholds, Refining peer group definitions, Updating detection rules, Scheduling model retraining, or Adding new detection scenarios. 

#### **4.3 Data Manager Workflows** 

Data Managers ensure the healthcare graph is built on high-quality, well-integrated data. They monitor data pipelines, resolve data quality issues, and perform entity resolution. The AI assists by automating entity matching and flagging data anomalies that require human review. 

1. Monitor Data Ingestion Pipeline: Data Manager accesses the Data Quality Dashboard showing: Latest data load status (success/failure, record counts), Validation error statistics (by error type and severity), Entity resolution metrics (duplicates found, auto-merged, pending review), and Data freshness indicators (time since last successful load). 

2. Review Quarantine Queue (AI-Flagged): The system flags records that failed critical validation and require manual review. The AI groups quarantined records by issue type: Missing required fields, Invalid foreign key references, Failed business rule checks, and Suspicious outliers (e.g., claim amounts 10× normal). The Data Manager reviews each group and decides whether to: Correct data (if error is obvious), Request correction from source system, or Reject record permanently. 

3. Entity Resolution Workbench (AI-Assisted): The AI presents candidate duplicate entities (participants, providers, doctors) for human review. For each candidate pair, the AI shows: Matching attributes (name, ID, date of birth, region), Similarity score (0-100), and Recommended action (auto-merge, manual merge, not a duplicate). The Data Manager reviews high-confidence matches and approves or rejects them. Decisions are fed back to improve the entity resolution models. 

4. Graph Construction Validation: After data loads complete and the graph is updated, the Data Manager validates: Node and edge counts match expectations, Key entity types are properly linked, No orphaned nodes (entities with no relationships), and Graph metrics are within normal ranges. 

5. Escalate Data Quality Issues: If systemic data quality issues are detected (e.g., sudden drop in data completeness, spike in validation errors), the Data Manager escalates to source system owners and tracks resolution. 

### **5. AI and Machine Learning Integration** 

This section provides detailed specifications for how artificial intelligence and machine learning are integrated throughout JKN RiskGraph to automate risk detection, explain anomalies, and continuously improve accuracy. The AI integration is designed to augment human investigators, not replace them—the system detects patterns and prioritizes cases, but humans make final fraud determinations. 

#### **5.1 Anomaly Detection Framework** 

Anomaly detection is the core AI capability that identifies unusual patterns in the healthcare graph. Unlike traditional rule-based systems that only catch known fraud schemes, anomaly detection can surface novel patterns that deviate from normal behavior without requiring explicit programming for each fraud type. 

##### **How Anomaly Detection Works in JKN RiskGraph:** 

Step 1 - Establish Normal Behavior Baseline: For each provider, doctor, and network, the system establishes what "normal" looks like by analyzing historical patterns across their peer group. Normal behavior is defined as: Average claim rates, amounts, and distributions for similar entities, Typical referral patterns within specialty and region, Expected diagnosis and procedure distributions, and Standard length of stay by diagnosis. The AI learns these baselines from large volumes of historical data, capturing natural variation rather than imposing rigid thresholds. 

Step 2 - Compute Deviation Metrics: For each new claim or activity period, the system computes how much the entity deviates from its baseline. Deviation metrics include: Statistical deviation (Z-scores, percentiles relative to peer distribution), Graph structural deviation (unusual network density, centrality, community membership), Temporal deviation (sudden changes in activity patterns), and Multivariate deviation (combinations of features that are individually normal but collectively unusual). 

Step 3 - Apply Unsupervised ML Models: Multiple unsupervised machine learning algorithms run in parallel to detect anomalies from different perspectives: Isolation Forest identifies instances that are easiest to isolate from the normal data distribution (requiring fewer decision tree splits). This is effective for detecting outliers in high-dimensional feature spaces. Local Outlier Factor (LOF) compares the local density of each instance to its neighbors, identifying points in sparse regions as anomalies. This catches entities whose behavior differs from their immediate peers. Clustering-based detection groups entities by behavior similarity, then flags entities that do not fit well into any cluster or form very small clusters. Autoencoder neural networks learn to reconstruct normal patterns, then flag instances with high reconstruction error as anomalies. 

Step 4 - Aggregate Anomaly Signals: Each detection method produces an anomaly score. These scores are aggregated using weighted averaging (weights learned from historical investigation outcomes) to produce a unified anomaly score per entity. The system also 

tracks which specific detection methods contributed most to the score, enabling explainability. 

Step 5 - Threshold and Alert: Entities with anomaly scores exceeding configurable thresholds are flagged as suspicious. Thresholds are set to balance false positives (flagging too much normal activity) and false negatives (missing actual fraud). The AI recommends threshold settings based on historical investigation capacity and accuracy rates. 

##### **Practical Example: Detecting Referral Concentration Anomaly** 

Consider Dr. Ahmad, a general practitioner in Region A. The anomaly detection system analyzes Dr. Ahmad's referral patterns: 

Normal Baseline (Peer Group): General practitioners in Region A refer patients to an average of 4.2 different hospitals, with no single hospital receiving more than 35% of referrals. 

Dr. Ahmad's Observed Pattern: Over the past 90 days, Dr. Ahmad referred 87 patients to 2 hospitals: Hospital X received 71 referrals (82%), Hospital Y received 16 referrals (18%). 

Deviation Analysis: The system computes: 

- Referral concentration to Hospital X is 82% vs peer median of 28% (deviation: 5.4 standard deviations, 99.9th percentile) 

- Number of unique referral targets is 2 vs peer median of 4 (deviation: 2.1 standard deviations) 

- Hospital X specialization does NOT align with Dr. Ahmad's patient diagnosis distribution (mixed cases, not a specialty referral pattern) 

##### Anomaly Score Contribution: 

- Isolation Forest flags Dr. Ahmad as an outlier (score: 0.87) 

- Statistical Z-score anomaly (5.4σ) triggers high-confidence signal 

- Graph centrality analysis shows Dr. Ahmad has unusually high edge weight to Hospital X 

- Composite anomaly score: 91/100 

Human Review: The system flags this network for investigator review. The investigator examines whether there are legitimate explanations (e.g., Hospital X is the only nearby facility, specialty care requirements) or whether this represents a kickback or referral fee arrangement. 

#### **5.2 Risk Scoring Algorithm** 

Risk scoring combines outputs from multiple detection methods (rules, statistical tests, graph analytics, ML models) into a unified 0-100 risk score that investigators use to prioritize their work. The scoring algorithm is designed to be transparent, calibrated, and adaptive. 

##### **Risk Score Fusion Algorithm:** 

The risk fusion algorithm operates in several stages: 

##### Stage 1 - Signal Collection: 

For each entity or network, collect all risk signals generated by detection methods: - Rule-based signals (e.g., CLONING_PATTERN, REPEAT_BILLING, REFERRAL_CONCENTRATION) 

- Statistical anomaly signals (e.g., PROCEDURE_FREQUENCY_OUTLIER, LOS_DEVIATION) 

- Graph analytics signals (e.g., HIGH_DEGREE_CENTRALITY, ANOMALOUS_COMMUNITY) 

- ML model predictions (e.g., risk probability from gradient boosting model) 

Each signal has an associated confidence level (0-1) based on signal strength and historical accuracy. 

##### Stage 2 - Signal Normalization: 

Different detection methods output signals in different formats (binary flags, probabilities, Z-scores). All signals are normalized to 0-100 scale: 

- Binary flags (rule matches): 0 if no match, configured weight (e.g., 75) if match 

- Statistical deviations: Linear mapping of Z-score to 0-100 (e.g., 3σ = 75, 5σ = 95) 

- ML probabilities: Direct mapping (probability 0.85 → score 85) 

- Graph measures: Percentile-based mapping (e.g., 95th percentile centrality → score 75) 

##### Stage 3 - Weighted Aggregation: 

Each signal type is assigned a weight based on historical investigation outcomes. Weights are learned via logistic regression over past investigation data: 

- Rule signals: Weight = 0.25 (rules are specific but may have false positives) 

- Statistical signals: Weight = 0.30 (peer comparison is strong evidence) 

- Graph signals: Weight = 0.20 (structural patterns are informative but indirect) 

- ML predictions: Weight = 0.25 (models learn from all signals but can overfit) 

Composite score = Σ(signal_score × weight × confidence) / Σ(weight × confidence) 

Stage 4 - Network-Level Aggregation (for networks): 

For networks (connected subgraphs), the system computes: 

- Max entity score in network (ceiling) 

- Average entity score (typical behavior) 

- Network-specific multipliers (size, density, temporal synchronization) 

Network score = max(entity_scores) × network_multiplier + avg(entity_scores) × (1 - network_multiplier) 

Stage 5 - Calibration: 

Raw composite scores are calibrated to ensure they match historical risk prevalence: - Map score distributions to target distributions (e.g., 5% of entities should score >80) 

- Apply isotonic regression to ensure score monotonically correlates with actual risk 

- Adjust thresholds quarterly based on investigation outcomes 

Stage 6 - Output: 

Final risk score (0-100) is stored alongside: 

- Risk category (LOW, MEDIUM, HIGH, CRITICAL) 

- Top contributing signals (ranked by contribution to final score) 

- Confidence interval (uncertainty in score estimation) 

#### **5.3 Explainable AI Implementation** 

Explainability is a core requirement—investigators must understand WHY a network was flagged, not just that it scored high. JKN RiskGraph implements explainability at multiple levels: global (what patterns does the system detect in general), local (why was this specific entity flagged), and contrastive (how does this entity differ from normal). 

##### **Explainability Techniques Used:** 

1. Signal Attribution (Feature Importance): For each flagged entity, the system ranks which risk signals contributed most to the final score. This is computed by measuring score change when each signal is removed. Example output: "Top Risk Signals for Network #1027: Referral concentration (+24 points, 26% of total score), Claim similarity (+21 points, 23% of total score), Procedure frequency anomaly (+19 points, 21% of total score), ML model prediction (+15 points, 16% of total score), Graph community structure (+8 points, 9% of total score)" 

2. Natural Language Explanations (Template-Based NLG): The system generates plainlanguage explanations by populating templates with specific values. Templates are structured as: Pattern description (what was observed), Peer comparison (how it differs from normal), Financial context (amount at risk), Entity relationships (who is involved). Example: "Dr. Ahmad referred 82% of patients to Hospital X, compared to 28% peer average. This concentration involves 71 patients and Rp 340M in claims over 90 days. Hospital X is owned by Dr. Ahmad's brother-in-law (relationship detected in ownership records)." 

3. Visual Explanations (Highlighted Graph Visualization): In network visualizations, the system uses color coding and edge thickness to show: Red/orange nodes and edges indicate anomalous patterns, Green nodes indicate normal behavior, Edge thickness represents relationship strength, Node size represents entity size (claim volume, patient count). Hovering over highlighted elements shows why they were flagged. 

4. Counterfactual Explanations: For ML model predictions, the system generates counterfactuals explaining what would need to change for the entity to be classified as normal. Example: "Hospital X would not be flagged if: (1) Its average LOS decreased from 6.2 days to under 4.5 days, OR (2) Its procedure ABC frequency decreased from 48% to under 20%, OR (3) Its claim similarity across patients decreased from 87% to under 65%." 

5. Peer Comparison Drill-Down: For any flagged metric, investigators can drill into detailed peer comparison showing: Entity value, Peer group distribution (histogram or box plot), Entity percentile ranking, and Statistical significance (p-value or confidence interval). This helps investigators assess whether deviations are meaningful or within normal variation. 

6. SHAP Values (for ML Models): For gradient boosting model predictions, the system computes SHAP (SHapley Additive exPlanations) values showing how each feature contributed to the prediction. SHAP values are presented as waterfall charts showing how 

features push the prediction above or below the baseline. This is particularly useful for Risk Analysts validating model behavior. 

#### **5.4 Feedback Loop and Model Training** 

JKN RiskGraph implements a continuous learning cycle where investigator feedback improves detection accuracy over time. This is critical because fraud schemes evolve— models trained on historical data will gradually degrade unless retrained with fresh examples. The feedback loop operates on multiple timescales. 

##### **Feedback Loop Architecture:** 

##### Real-Time Feedback (Immediate): 

When an investigator makes a decision on a flagged network (confirm, dismiss, escalate), the system immediately captures: 

- Investigation outcome (confirmed risk, false positive, needs more evidence) 

- Investigator confidence (high, medium, low) 

- Most convincing evidence (which signals/visualizations were most helpful) 

- Dismissal reason if applicable (legitimate business relationship, peer group mismatch, data error, etc.) 

This feedback is stored in a labeled dataset for model retraining. 

##### Weekly Aggregation: 

Every week, the system aggregates feedback statistics: 

- Confirmation rate by risk type (what % of flagged patterns were confirmed) 

- False positive patterns (what characteristics do dismissed cases share) 

- Signal accuracy (which detection methods are most predictive of confirmed risks) 

- Investigator feedback sentiment (are explanations helpful, are scores calibrated) 

These statistics inform rule refinement and threshold adjustments. 

##### Monthly Model Retraining: 

Once per month (or when 100+ new labeled cases are available), the system retrains ML models: 

1. Combine new investigation outcomes with historical training data 

2. Re-extract features for all labeled entities 

3. Split into train/validation/test sets (70/15/15) 

4. Train new gradient boosting models with hyperparameter tuning 

5. Evaluate new model performance vs previous model on holdout test set 

6. If new model performs better (higher F-score on test set), deploy it; otherwise keep 

existing model 

7. Document model version, training data statistics, and performance metrics 

##### Quarterly System Review: 

Every quarter, Risk Analysts conduct a comprehensive review: 

- Model performance trends over time (are models degrading?) 

- Emerging fraud patterns not covered by existing rules 

- Peer group calibration (are peer groupings still appropriate?) 

- Risk score distribution calibration (are scores well-distributed?) 

- Investigator efficiency metrics (average time per investigation, queue throughput) 

This review informs strategic improvements like adding new detection rules, refining graph algorithms, or expanding scope to new risk types. 

Human-in-the-Loop Principle: 

Critically, the feedback loop preserves human judgment: 

- Models learn from investigator decisions, but do not make autonomous fraud determinations 

- High-confidence model predictions are reviewed by humans before action 

- Investigators can override model predictions and provide reasoning 

- The system makes it easy to provide feedback (single-click actions, optional free-text notes) 

- Feedback is used for learning, not for evaluating investigator performance (no punishment for false positives) 

### **6. System Flow Diagrams** 

This section describes the end-to-end flow of data and user interactions through JKN RiskGraph, from data ingestion through investigation to feedback. While presented as text (diagram tools are not available), these descriptions provide sufficient detail for system architects and developers to understand information flow. 

#### **6.1 End-to-End Investigation Flow** 

This flow describes the complete journey from raw JKN data to investigation outcome and model improvement. 

• 

[START: JKN Data Sources] ↓ 

[Data Ingestion Layer] 

- Claims database queries extract new/updated claims 

- Participant, provider, doctor master data refreshed 

- Data lands in staging tables ↓ 

[Data Quality Pipeline] 

- Validation rules check completeness, format, business rules 

- Failed records quarantined for Data Manager review 

- Valid records proceed ↓ 

[Entity Resolution Engine] 

- ML models identify duplicate participants, providers, doctors 

- High-confidence matches auto-merged 

- Ambiguous matches flagged for Data Manager review 

- Master entity IDs assigned ↓ 

[Graph Construction] 

- Clean, resolved entities loaded into graph database 

- Nodes created for participants, doctors, providers, claims 

- Edges created for relationships (visits, treats, submits, generates) 

- Graph indexed and optimized 

↓ 

[Feature Engineering] 

- Compute node-level features (degrees, centrality, activity metrics) 

- Compute edge-level features (weights, frequencies, temporal patterns) 

- Compute network-level features (community membership, densities) 

- Compare to peer groups and historical baselines ↓ 

[Risk Detection Engine - Parallel Processing] 

- Rule Engine: Apply domain rules, generate rule signals 

- Statistical Engine: Compute anomaly scores via Isolation Forest, LOF 

- Graph Analytics: Compute centrality, community, motif detection 

- ML Models: Predict risk probabilities via gradient boosting 

↓ 

##### [Risk Fusion] 

- Aggregate signals from all detection methods 

- Apply weighted fusion algorithm 

- Normalize to 0-100 risk scores 

- Compute network-level aggregations 

- Calibrate scores ↓ 

[Risk Prioritization] 

- Rank entities and networks by risk score 

- Apply financial impact and novelty multipliers 

- Filter by thresholds 

- Generate priority investigation queue 

↓ 

[Explainability Generation] 

- For each flagged entity/network: 

- Compute signal attributions (feature importance) 

- Generate natural language explanations 

- Prepare peer comparison data 

- Create visual highlights for graph rendering 

↓ 

[Investigation Dashboard] 

- Risk Investigator logs in 

- Views priority queue (top 20 risks) 

- Selects network for detailed investigation 

↓ 

[Network Investigation View] 

- System displays: risk score breakdown, AI explanation, network visualization, peer comparisons, claim details, timeline 

- Investigator reviews evidence 

- Investigator can ask AI assistant questions 

↓ 

[Investigation Decision] 

- Investigator selects action: 

- Confirm Risk → escalate to supervisor 

- Dismiss → remove from queue 

- Need More Evidence → keep in queue with notes 

↓ 

##### [Feedback Capture] 

- System logs: investigation outcome, investigator confidence, helpful signals, dismissal 

##### reason (if applicable) 

- Feedback stored in labeled dataset 

↓ 

[If Confirmed Risk] 

↓ 

[Case Documentation] 

- AI generates investigation brief 

- Attaches evidence (network diagram, claims export, peer charts) 

- Routes to supervisor for approval 

↓ 

[Supervisor Review] 

- Supervisor reviews brief and evidence 

- Approves for audit or sends back to investigator 

↓ 

[Audit Process] 

- Audit team conducts detailed investigation 

- Final determination: confirmed fraud / legitimate / dismissed 

↓ 

[Audit Outcome Feedback] 

- Final outcome logged 

- Feedback fed back to Risk Detection Engine 

↓ 

[Model Retraining] (Monthly) 

- Aggregate labeled data from investigations 

- Retrain gradient boosting models 

- Evaluate performance on holdout test set 

- Deploy new model if improved 

↓ 

[System Improvement Loop] 

- Risk Analysts review trends 

- Adjust rules, thresholds, peer groups 

- Add new detection scenarios 

↓ 

[CYCLE REPEATS with improved models] 

#### **6.2 Data Processing Flow (Detailed)** 

This section provides more detail on the data processing pipeline, highlighting where AI assists at each stage: 

##### Stage 1: Raw Data Extraction 

- Scheduled jobs (daily 2:00 AM) extract data from JKN databases 

- Claims: Last 7 days of new/updated claims 

- Entities: Changed participant, provider, doctor records 

- Data extracted as CSV files or direct database queries 

- Initial volume: ~100,000 claims per day, ~5,000 entity updates per day 

##### Stage 2: Data Validation (AI-Assisted) 

- Schema validation: Check field presence and data types 

- Referential integrity: Verify foreign keys exist 

- Business rules: Apply JKN policy rules (amount > 0, dates consistent, etc.) 

- AI anomaly detection: Flag statistical outliers (claim amounts 10× normal, impossible service combinations) 

- Pass rate target: >95% records pass validation 

- Failed records quarantined with error explanations 

##### Stage 3: Entity Resolution (ML-Powered) 

- Candidate generation: Find potential duplicate records using blocking keys (name prefix, region, date of birth) 

- Similarity scoring: ML model computes match probability for each candidate pair based on: Name similarity (Jaro-Winkler distance), ID similarity (edit distance), Date of birth exact match, Geographic proximity 

- Decision logic: Probability > 0.9: Auto-merge, Probability 0.7-0.9: Flag for human review, Probability < 0.7: Not a duplicate 

- Master ID assignment: Each entity cluster assigned persistent master ID 

- Throughput: Process 5,000 entity updates in < 30 minutes 

##### Stage 4: Graph Database Load 

- Incremental update: Only new/changed entities and relationships added 

- Node upsert: Create nodes if not exist, update properties if exist 

- Edge upsert: Create edges if not exist, update weights if exist 

- Index maintenance: Rebuild indexes on affected nodes 

- Consistency check: Verify no orphaned nodes or edges 

- Performance target: Load 100,000 claims + relationships in < 2 hours 

##### Stage 5: Feature Computation (Batch Processing) 

- For each entity type (participant, doctor, provider), compute rolling window features: 

- 30-day features: Recent activity metrics 

- 90-day features: Medium-term patterns 

- 12-month features: Annual baselines 

- Peer group assignment: Cluster entities into peer groups using k-means on feature vectors 

- Peer statistics: Compute median, mean, std dev for each feature by peer group 

- Feature storage: Save features to feature store (separate from graph database for faster ML access) 

- Computation time: ~4 hours for full graph refresh 

##### Stage 6: Risk Detection Execution 

- Run all detection methods in parallel (multi-threaded): 

- Rule engine: 15 minutes 

- Statistical anomaly detection: 45 minutes 

- Graph analytics: 60 minutes 

- ML model inference: 30 minutes 

- Aggregate signals: Merge outputs from all methods 

- Risk fusion: Apply fusion algorithm, generate final scores 

- Total processing time: ~2 hours (parallel execution) 

##### Stage 7: Queue Generation and Notification 

- Select top N highest-risk entities/networks (N = 500 default) 

- Filter by configurable thresholds (minimum score, financial impact) 

- Assign to investigator queues (round-robin or specialty-based) 

- Send email notifications to investigators with daily digest 

- Update investigation dashboard 

##### Stage 8: Monitoring and Alerting 

- Data Quality Monitoring: Track validation pass rates, entity resolution rates, data freshness 

- Pipeline Monitoring: Track job success/failure, processing times, error rates 

- Model Monitoring: Track risk detection rates, score distributions, alert volumes 

- Alerts triggered if: Validation pass rate drops below 90%, Processing time exceeds 8 hours, Error rate exceeds 5%, Risk detection rate changes by >50% (possible data quality issue or model problem) 

#### **6.3 Real-Time Investigation Flow** 

This flow shows what happens when an investigator interacts with the system during a live investigation session: 

1. Investigator Login 

- User authenticates via SSO or username/password 

- System loads user profile, preferences, recent activity 

- Dashboard pre-loads with cached priority queue (refreshed every 15 minutes) 

2. Queue View Interaction 

- User scrolls through priority queue 

- Each scroll triggers lazy loading of next 10 networks 

- Hover over network shows tooltip with quick summary (AI-generated, pre-computed) 

- Click on network loads detailed view 

3. Network Detail Load (Server-Side) 

- Backend retrieves network from graph database (query time: <1 second) 

- Fetches associated claims, entities, risk signals 

- Computes peer comparisons on-the-fly (cached for 1 hour) 

- Generates explainability data (pre-computed, retrieved from cache) 

- Assembles JSON response with all data 

4. Network Visualization Rendering (Client-Side) 

- React component receives network data 

- Cytoscape.js library renders graph (up to 500 nodes) 

- Applies layout algorithm (force-directed, takes 1-2 seconds) 

- Highlights suspicious nodes/edges based on risk signals 

- User can interact: zoom, pan, click nodes, filter by entity type 

5. AI Assistant Query (Optional) 

- User types question: "Why is referral rate suspicious?" 

- Frontend sends query to LLM endpoint with context: network data, risk signals, peer comparisons 

- LLM generates answer in 2-3 seconds 

- Answer displayed in chat interface 

- Query and response logged for future training 

6. Evidence Drill-Down 

- User clicks "View Claims" 

- System retrieves claim details from database 

- Displays paginated table (20 claims per page) 

- User can sort by similarity score, claim amount, date 

- Click individual claim shows full claim details 

7. Investigation Decision 

- User clicks "Confirm Risk" button 

- System prompts for confidence level and optional notes 

- On submit: Backend logs decision with timestamp, user ID, network ID, outcome, confidence, notes 

- Network moved to "Escalated" status 

- Supervisor receives notification 

8. Case Documentation Generation 

- Backend triggers async job to generate investigation brief 

- Job pulls network data, risk signals, claims, peer comparisons 

- Populates Word document template with data 

- Generates network diagram as PNG 

- Exports claims to Excel 

- Packages documents into ZIP file 

- Stores in document repository 

- Sends email to supervisor with download link 

- Job completes in 10-30 seconds 

9. Investigation Tracking 

- Investigator can view case status in "My Investigations" tab 

- Shows all cases they've worked on with current status 

- Can add follow-up notes or reopen dismissed cases 

- System tracks time spent per case for workload analytics 

### **7. Interface Specifications** 

This section describes the key user interfaces in detail, including layout, components, interactions, and how AI-generated content is presented. Interfaces are designed to be intuitive for users with varying technical proficiency while providing access to sophisticated analytical capabilities. 

#### **7.1 Investigation Dashboard (Main Landing Page)** 

Layout: 

- Header: JKN RiskGraph logo, user profile menu, notifications bell 

- Left sidebar: Navigation menu (Dashboard, My Investigations, Analytics, Administration) 

- Main content area: Divided into widgets 

Widgets: 

1. Priority Queue (Top Priority): 

- Occupies top 60% of main area 

- Shows table of top 20 highest-risk networks 

- Columns: Network ID (clickable), Risk Score (color-coded gauge 0-100), Primary Risk Type (icon + label), Entities Involved (count), Financial Impact (Rp amount), Detection Date, Action Button (Investigate) 

- Sortable by any column 

- Filter panel collapses from right: Risk type, Score range, Region, Provider type, Date 

range 

- Pagination at bottom (20 per page) 

- Real-time updates: New high-priority risks appear with animation 

2. Risk Trend Chart (Middle Right): 

- Line chart showing risk detection volume over past 30 days 

- Lines for each risk type (Cloning, Referral, LOS, etc.) 

- Hover shows exact counts 

- Click line to filter main queue by that risk type 

##### 3. My Statistics (Bottom Right): 

- Cards showing: Cases Investigated (this month), Confirmation Rate (%), Avg Time Per Case, Pending Cases 

- Color-coded indicators (green/yellow/red based on targets) 

4. Quick Actions (Bottom Left): 

- Buttons for common actions: Generate Report, View Audit Status, Browse Historical Cases, Contact Support 

Interactions: 

- Click network row: Navigate to Network Detail View 

- Click "Filter": Expand filter panel with animation 

- Apply filters: Queue updates instantly (AJAX request) 

- Export Queue: Download filtered queue as Excel 

- Responsive: Works on desktop (1366x768 minimum) and tablets 

#### **7.2 Network Detail View** 

Layout: 

- Breadcrumb navigation: Dashboard > Network #1027 

- Top section: Network Summary Card (fixed position when scrolling) 

- Tab navigation: Overview | Claims | Timeline | AI Insights 

- Main content area: Changes based on selected tab 

Network Summary Card (Always Visible): 

- Network ID and alias (e.g., "Provider X Referral Network") 

- Risk Score: Large gauge visualization (0-100) with color coding 

- Risk Category: Badge (LOW/MEDIUM/HIGH/CRITICAL) 

- Primary Risk Type: Icon and label 

- Key Entities: Provider names, Doctor count, Patient count 

- Financial Impact: Total claim amount 

- Detection Date: When network was first flagged 

- Action Buttons: Confirm Risk (red), Dismiss (gray), Need More Evidence (yellow) 

##### Tab 1: Overview 

- Left side (40% width): Network Visualization 

- Interactive graph rendered with Cytoscape.js 

- Nodes: Providers (large blue circles), Doctors (medium green), Patients (small orange) 

- Edges: Thickness = relationship strength, Color = suspicious (red) or normal (gray) 

- Controls: Zoom in/out, Reset view, Layout options (force-directed, hierarchical) 

- Legend: Explains node colors and edge meanings 

- Hover node: Shows entity details in tooltip 

- Click node: Highlights related nodes and edges 

- Right side (60% width): Risk Explanation Panel 

- AI-Generated Explanation: Plain-language text explaining why network is suspicious (2-3 paragraphs) 

- Risk Signal Breakdown: Horizontal bar chart showing contribution of each detection method to final score 

- Top Contributing Factors: Ordered list of top 5 specific patterns (e.g., "82% referral concentration to Hospital X", "87% claim similarity across patients") 

- Peer Comparison Table: Shows how key entities compare to peer averages (Entity, Metric, Value, Peer Avg, Deviation) 

##### Tab 2: Claims 

- Data table showing all claims in network 

- Columns: Claim ID, Participant (anonymized), Date, Amount, Diagnosis, Procedure, Similarity Score, Flags 

- Sortable by any column 

- Search/filter by participant, date range, diagnosis 

- Click claim: Opens claim detail modal with full claim information 

- Bulk actions: Select claims, Export to Excel 

- Pagination: 20 claims per page 

##### Tab 3: Timeline 

- Horizontal timeline visualization showing when suspicious activity occurred 

- X-axis: Time (months/weeks) 

- Y-axis: Activity intensity (claim count or amount) 

- Markers for key events (first suspicious claim, peak activity, latest claim) 

- Pattern annotations: AI-generated labels like "Escalating Pattern", "Sustained Activity", 

- "Recent Spike" 

- Hover over time period: Shows claim details for that period 

##### Tab 4: AI Insights 

- AI Assistant Chat Interface: Investigator can ask questions about the network 

- Pre-defined question buttons: "Why is this risky?", "Are there similar networks?", "What is the financial impact?", "What evidence is strongest?" 

- Chat history: Shows previous questions and AI responses 

- Evidence References: AI cites specific data (claims, metrics) in its answers 

- Copy button: Copy AI response to clipboard 

##### Action Flow: 

When investigator clicks "Confirm Risk": 

1. Modal dialog appears asking for: Confidence Level (High/Medium/Low dropdown), Optional Notes (text area), Escalation Target (Supervisor dropdown) 

2. Click "Submit": System shows loading spinner 

3. Backend processes decision: Logs outcome, Generates investigation brief (async job), Sends notification to supervisor, Removes network from queue 

4. Success message: "Network #1027 escalated to Supervisor Ahmad. Investigation brief will be ready in ~30 seconds." 

5. Return to dashboard 

