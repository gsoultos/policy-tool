import React from "react";
import {
    Alert,
    AppBar,
    Button, Card, CardContent,
    Dialog,
    DialogContent,
    Divider,
    Fab, IconButton, Snackbar, Toolbar, Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AbacElement from "./AbacElement";
import AbacSettingsElement from "./AbacSettingsElement";
import AbacTargetElement from "./AbacTargetElement";
import AbacRulesElement from "./AbacRulesElement";
import {ABAC_API, CATEGORY_API} from "../App";
import {Policy as IPolicy} from "../api";
import {Policy} from "../api/model/policy";
import {Target} from "../api/model/target";
import {Rule} from "../api/model/rule";
import {AnyOf} from "../api/model/anyOf";
import {AllOf} from "../api/model/allOf";
import {Match} from "../api/model/match";
import {AttributeValueType} from "../api/model/attributeValueType";
import {AttributeDesignatorType} from "../api/model/attributeDesignatorType";
import {Attribute} from "../api/model/attribute";
import {DataGrid} from "@mui/x-data-grid";

class AbacPolicy extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            dialog: false,
            subjectAttributes: [],
            resourceAttributes: [],
            actionAttributes: [],
            environmentAttributes: [],
            abacPolicies: [],
            description: "",
            policyId: "",
            version: 0,
            ruleCombiningAlgorithm: "",
            maxDelegationDepth: 0,
            selectedSubjectAttribute: "",
            selectedResourceAttribute: "",
            selectedActionAttribute: "",
            selectedEnvironmentAttribute: "",
            rules: [],
            error: false,
            errorMessage: ""
        }
    }

    private openDialog = () => {
        this.setState({dialog: true});
    }

    private closeDialog = () => {
        this.setState({
            dialog: false,
            description: "",
            policyId: "",
            version: 0,
            ruleCombiningAlgorithm: "",
            maxDelegationDepth: 0,
            selectedSubjectAttribute: "",
            selectedResourceAttribute: "",
            selectedActionAttribute: "",
            selectedEnvironmentAttribute: "",
            rules: []
        });
    }

    private onDescriptionChange = (event: any) => {
        this.setState({description: event.target.value});
    }

    private onPolicyIdChange = (event: any) => {
        this.setState({policyId: event.target.value});
    }

    private onVersionChange = (event: any) => {
        this.setState({version: event.target.value});
    }

    private onRuleCombiningAlgorithmChange = (event: any) => {
        this.setState({ruleCombiningAlgorithm: event.target.value});
    }

    private onMaxDelegationDepthChange = (event: any) => {
        this.setState({maxDelegationDepth: event.target.value});
    }

    private onSubjectSelectedAttributeChange = (selectedAttribute: string) => {
        this.setState({selectedSubjectAttribute: selectedAttribute});
    }

    private onResourceSelectedAttributeChange = (selectedAttribute: string) => {
        this.setState({selectedResourceAttribute: selectedAttribute});
    }

    private onActionSelectedAttributeChange = (selectedAttribute: string) => {
        this.setState({selectedActionAttribute: selectedAttribute})
    }

    private onEnvironmentSelectedAttributeChange = (selectedAttribute: string) => {
        this.setState({selectedEnvironmentAttribute: selectedAttribute})
    }

    private onRulesChange = (rules: any[]) => {
        this.setState({rules: rules});
    }

    private generateRules(): Rule[] {
        const rules: Rule[] = [];
        this.state.rules.forEach((data: any) => {
            const rule = new Rule();
            rule.description = data.description;
            rule.ruleId = data.ruleId;
            rule.effect = data.effect;
            rule.target = this.generateTarget(data.subjectAttribute, data.resourceAttribute, data.actionAttribute, data.environmentAttribute);
            rules.push(rule);
        })
        return rules;
    }

    private generateMatch(category: string, attributes: any[], selectedAttribute: string): Match {
        const match = new Match();
        if (attributes) {
            const attribute: Attribute = attributes.filter((data: any) => {
                if (data[0] === selectedAttribute.split('/')[1]) {
                    return data[1] as Attribute
                }
            })[0][1];
            const attributeValue = new AttributeValueType();
            attributeValue.content = new Array<string>(selectedAttribute.split('/')[0]);
            attributeValue.dataType = attribute.attributeValues[0].dataType
            const attributeDesignator = new AttributeDesignatorType();
            attributeDesignator.attributeId = attribute.attributeId;
            attributeDesignator.dataType = attribute.attributeValues[0].dataType;
            attributeDesignator.issuer = attribute.issuer;
            attributeDesignator.category = category;
            attributeDesignator.mustBePresent = true;
            match.matchId = "urn:oasis:names:tc:xacml:1.0:function:string-equal";
            match.attributeValue = attributeValue;
            match.attributeDesignator = attributeDesignator;
        }
        return match;
    }

    private generateTarget(selectedSubject?: string, selectedResource?: string, selectedAction?: string, selectedEnvironment?: string): Target {
        const matches: Match[] = [];
        if (selectedSubject && selectedSubject !== "") {
            matches.push(this.generateMatch("urn:oasis:names:tc:xacml:3.0:attribute-category:subject", this.state.subjectAttributes, selectedSubject));
        }

        if (selectedResource && selectedResource !== "") {
            matches.push(this.generateMatch("urn:oasis:names:tc:xacml:3.0:attribute-category:resource", this.state.resourceAttributes, selectedResource));
        }

        if (selectedAction && selectedAction !== "") {
            matches.push(this.generateMatch("urn:oasis:names:tc:xacml:3.0:attribute-category:action", this.state.actionAttributes, selectedAction));
        }

        if (selectedEnvironment && selectedEnvironment !== "") {
            matches.push(this.generateMatch("urn:oasis:names:tc:xacml:3.0:attribute-category:environment", this.state.environmentAttributes, selectedEnvironment));
        }

        const allOve = new AllOf();
        allOve.matches = matches;
        const allOves: AllOf[] = [];
        allOves.push(allOve);
        const anyOve = new AnyOf();
        anyOve.allOves = allOves;
        const anyOves: AnyOf[] = [];
        anyOves.push(anyOve);
        const target = new Target();
        target.anyOves = anyOves;
        return target;
    }

    private addPolicy = () => {
        const policy = new Policy();

        policy.description = this.state.description
        policy.target = this.generateTarget(this.state.selectedSubjectAttribute, this.state.selectedResourceAttribute, this.state.selectedActionAttribute, this.state.selectedEnvironmentAttribute);
        policy.combinerParametersAndRuleCombinerParametersAndVariableDefinitions = this.generateRules();
        policy.policyId = this.state.policyId;
        policy.version = this.state.version;
        policy.ruleCombiningAlgId = this.state.ruleCombiningAlgorithm;
        policy.maxDelegationDepth = this.state.maxDelegationDepth;

        ABAC_API.addABACPolicy((policy as unknown) as IPolicy).then(() => {
            this.getABACPolicies();
            this.closeDialog();
        }).catch(() => {
            this.setState({error: true, errorMessage: "Could not create new policy."})
        })
    }

    private deletePolicy = () => {
        ABAC_API.deleteABACPolicy(this.state.policyId).then(() => {
            this.getABACPolicies();
            this.closeDialog();
        }).catch(() => {
            this.setState({error: true, errorMessage: "Could not delete policy."})
        })
    }

    private getABACPolicies() {
        ABAC_API.getABACPolicies().then(result => {
            this.setState({
                abacPolicies: Object.entries(result.data)
            });
        });
    }

    componentDidMount() {
        CATEGORY_API.getAttributes("subj").then(result => {
            this.setState({
                subjectAttributes: Object.entries(result.data)
            });
        });

        CATEGORY_API.getAttributes("rsc").then(result => {
            this.setState({
                resourceAttributes: Object.entries(result.data)
            });
        });

        CATEGORY_API.getAttributes("act").then(result => {
            this.setState({
                actionAttributes: Object.entries(result.data)
            });
        });

        CATEGORY_API.getAttributes("env").then(result => {
            this.setState({
                environmentAttributes: Object.entries(result.data)
            });
        });

        this.getABACPolicies();
    }

    render() {
        return (
            <div className="content">
                <Card>
                    <CardContent>
                        <DataGrid
                            autoHeight={true}
                            hideFooter
                            columns={[
                                {field: 'description', headerName: 'Description', flex: 1},
                                {field: 'policyId', headerName: 'Policy ID', flex: 1},
                                {field: 'version', headerName: 'Version', flex: 1},
                                {field: 'ruleCombiningAlgId', headerName: 'Rule Combining Algorithm ID', flex: 1},
                                {field: 'maxDelegationDepth', headerName: 'Max Delegation Depth', flex: 1}
                            ]}
                            rows={
                                this.state.abacPolicies.map((data: any) => {
                                    return {
                                        id: data[0],
                                        description: data[1].description,
                                        policyId: data[1].policyId,
                                        version: data[1].version,
                                        ruleCombiningAlgId: data[1].ruleCombiningAlgId,
                                        maxDelegationDepth: data[1].maxDelegationDepth
                                    }
                                })
                            }
                            onSelectionModelChange={(selectionModel, details) => {
                                if (this.state.abacPolicies.length > 0) {
                                    let policy = this.state.abacPolicies.filter((data: any) => {
                                        if (data[0] == selectionModel[0]) {
                                            return data;
                                        }
                                    });

                                    if (policy.length > 0) {
                                        policy = policy[0][1];

                                        let selectedSubjectAttribute = "";
                                        let selectedResourceAttribute = "";
                                        let selectedActionAttribute = "";
                                        let selectedEnvironmentAttribute = "";

                                        policy.target.anyOves[0].allOves[0].matches.forEach((match: any) => {
                                            if (match.attributeDesignator.category == "urn:oasis:names:tc:xacml:3.0:attribute-category:subject") {
                                                selectedSubjectAttribute = `${match.attributeValue.content[0]}/${match.attributeDesignator.attributeId}`;
                                            } else if (match.attributeDesignator.category == "urn:oasis:names:tc:xacml:3.0:attribute-category:resource") {
                                                selectedResourceAttribute = `${match.attributeValue.content[0]}/${match.attributeDesignator.attributeId}`;
                                            } else if (match.attributeDesignator.category == "urn:oasis:names:tc:xacml:3.0:attribute-category:action") {
                                                selectedActionAttribute = `${match.attributeValue.content[0]}/${match.attributeDesignator.attributeId}`;
                                            } else if (match.attributeDesignator.category == "urn:oasis:names:tc:xacml:3.0:attribute-category:environment") {
                                                selectedEnvironmentAttribute = `${match.attributeValue.content[0]}/${match.attributeDesignator.attributeId}`;
                                            }
                                        });

                                        const rules: any[] = [];

                                        policy.combinerParametersAndRuleCombinerParametersAndVariableDefinitions.forEach((rule: any) => {
                                            let selectedSubjectAttribute = "";
                                            let selectedResourceAttribute = "";
                                            let selectedActionAttribute = "";
                                            let selectedEnvironmentAttribute = "";

                                            rule.target.anyOves[0].allOves[0].matches.forEach((match: any) => {
                                                if (match.attributeDesignator.category == "urn:oasis:names:tc:xacml:3.0:attribute-category:subject") {
                                                    selectedSubjectAttribute = `${match.attributeValue.content[0]}/${match.attributeDesignator.attributeId}`;
                                                } else if (match.attributeDesignator.category == "urn:oasis:names:tc:xacml:3.0:attribute-category:resource") {
                                                    selectedResourceAttribute = `${match.attributeValue.content[0]}/${match.attributeDesignator.attributeId}`;
                                                } else if (match.attributeDesignator.category == "urn:oasis:names:tc:xacml:3.0:attribute-category:action") {
                                                    selectedActionAttribute = `${match.attributeValue.content[0]}/${match.attributeDesignator.attributeId}`;
                                                } else if (match.attributeDesignator.category == "urn:oasis:names:tc:xacml:3.0:attribute-category:environment") {
                                                    selectedEnvironmentAttribute = `${match.attributeValue.content[0]}/${match.attributeDesignator.attributeId}`;
                                                }
                                            });

                                            rules.push({
                                                id: rule.ruleId,
                                                description: rule.description,
                                                ruleId: rule.ruleId,
                                                effect: rule.effect,
                                                subjectAttribute: selectedSubjectAttribute,
                                                resourceAttribute: selectedResourceAttribute,
                                                actionAttribute: selectedActionAttribute,
                                                environmentAttribute: selectedEnvironmentAttribute
                                            })
                                        });

                                        this.setState({
                                            dialog: true,
                                            description: policy.description,
                                            policyId: policy.policyId,
                                            version: policy.version,
                                            ruleCombiningAlgorithm: policy.ruleCombiningAlgId,
                                            maxDelegationDepth: policy.maxDelegationDepth,
                                            selectedSubjectAttribute: selectedSubjectAttribute,
                                            selectedResourceAttribute: selectedResourceAttribute,
                                            selectedActionAttribute: selectedActionAttribute,
                                            selectedEnvironmentAttribute: selectedEnvironmentAttribute,
                                            rules: rules
                                        });
                                    }
                                }
                            }}
                        />
                    </CardContent>
                </Card>
                <Fab color="primary" aria-label="add" onClick={this.openDialog} size="medium"
                     sx={{float: 'right', margin: '16px'}}>
                    <AddIcon/>
                </Fab>
                <Dialog fullScreen open={this.state.dialog} onClose={this.closeDialog}>
                    <AppBar sx={{position: 'relative'}}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.closeDialog}
                                aria-label="close"
                            >
                                <CloseIcon/>
                            </IconButton>
                            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                                {
                                    this.state.abacPolicies.filter((data: any) => {
                                        if (data[0] == this.state.policyId) {
                                            return data
                                        }
                                    }).length > 0 ? "Edit " + this.state.policyId : "New Policy"
                                }
                            </Typography>
                            <Button color="success" variant="contained" onClick={this.addPolicy} sx={{marginRight: 1}}>
                                {
                                    this.state.abacPolicies.filter((data: any) => {
                                        if (data[0] == this.state.policyId) {
                                            return data
                                        }
                                    }).length > 0 ? "Edit" : "Add"
                                }
                            </Button>
                            <Button color="error" variant="contained" sx={{
                                display:
                                    this.state.abacPolicies.filter((data: any) => {
                                        if (data[0] == this.state.policyId) {
                                            return data
                                        }
                                    }).length > 0 ? "" : "none"
                            }} onClick={this.deletePolicy}>Delete</Button>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <AbacElement title="Policy settings" details={
                            <AbacSettingsElement
                                onDescriptionChange={this.onDescriptionChange}
                                onPolicyIdChange={this.onPolicyIdChange}
                                onVersionChange={this.onVersionChange}
                                onRuleCombinationAlgorithmChange={this.onRuleCombiningAlgorithmChange}
                                onMaxDelegationDepthChange={this.onMaxDelegationDepthChange}
                                description={this.state.description}
                                policyId={this.state.policyId}
                                version={this.state.version}
                                ruleCombiningAlgorithm={this.state.ruleCombiningAlgorithm}
                                maxDelegationDepth={this.state.maxDelegationDepth}
                            />
                        }/>
                        <Divider/>
                        <AbacElement title="Target" details={
                            <AbacTargetElement subjectAttributes={this.state.subjectAttributes}
                                               resourceAttributes={this.state.resourceAttributes}
                                               actionAttributes={this.state.actionAttributes}
                                               environmentAttributes={this.state.environmentAttributes}
                                               onSubjectSelectedAttributeChange={this.onSubjectSelectedAttributeChange}
                                               onResourceSelectedAttributeChange={this.onResourceSelectedAttributeChange}
                                               onActionSelectedAttributeChange={this.onActionSelectedAttributeChange}
                                               onEnvironmentSelectedAttributeChange={this.onEnvironmentSelectedAttributeChange}
                                               selectedSubjectAttribute={this.state.selectedSubjectAttribute}
                                               selectedResourceAttribute={this.state.selectedResourceAttribute}
                                               selectedActionAttribute={this.state.selectedActionAttribute}
                                               selectedEnvironmentAttribute={this.state.selectedEnvironmentAttribute}
                            />
                        }/>
                        <Divider/>
                        <AbacElement title="Rules" details={
                            <AbacRulesElement subjectAttributes={this.state.subjectAttributes}
                                              resourceAttributes={this.state.resourceAttributes}
                                              actionAttributes={this.state.actionAttributes}
                                              environmentAttributes={this.state.environmentAttributes}
                                              onRulesChange={this.onRulesChange}
                                              rules={this.state.rules}
                            />
                        }/>
                    </DialogContent>
                </Dialog>
                <Snackbar
                    open={this.state.error}
                    onClose={() => this.setState({error: false, errorMessage: ""})}
                    autoHideDuration={5000}
                    anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
                    <Alert onClose={() => this.setState({error: false, errorMessage: ""})} severity="error"
                           sx={{width: '100%'}}>
                        {
                            this.state.errorMessage
                        }
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

export default AbacPolicy;