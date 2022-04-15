import React from "react";
import {
    Alert,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar
} from "@mui/material";
import {ABAC_API, PROJECT_API, XACML_API} from "../App";

class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: false,
            errorMessage: "",
            policy: "",
            abacPolicies: []
        }
    }

    private generateXACMLRequest = () => {
        XACML_API.generateXACMLRequest().then(result => {
            const element = document.createElement("a");
            const file = new Blob([result.data], {
                type: "text/xml"
            });
            element.href = URL.createObjectURL(file);
            element.download = "request.xml";
            document.body.appendChild(element);
            element.click();
        }).catch(() => {
            this.setState({
                error: true,
                errorMessage: 'Could not generate XACML request.'
            })
        })
    }

    private saveProject = () => {
        PROJECT_API.exportData().then(result => {
            const element = document.createElement("a");
            const file = new Blob([JSON.stringify(result.data)], {
                type: "text/json"
            });
            element.href = URL.createObjectURL(file);
            element.download = "project.json";
            document.body.appendChild(element);
            element.click();
        }).catch(() => {
            this.setState({
                error: true,
                errorMessage: 'Could not save the project.'
            })
        })
    }

    private loadProject = (event: any) => {
        const reader = new FileReader();
        reader.readAsText(event.target.files[0])

        reader.onload = (e) => {
            if (e?.target?.result?.toString()) {
                PROJECT_API.loadData(e.target.result.toString()).then(() => {
                    window.location.reload();
                }).catch(() => {
                    this.setState({
                        error: true,
                        errorMessage: 'Could not load the project.'
                    })
                })
            }
        }
    }

    private onPolicyChangeListener = (event: any) => {
        this.setState({
            policy: event.target.value
        })
    }

    private generateAbacPolicy = () => {
        XACML_API.generateABACPolicy(this.state.policy).then(result => {
            const element = document.createElement("a");
            const file = new Blob([result.data], {
                type: "text/xml"
            });
            element.href = URL.createObjectURL(file);
            element.download = "policy.xml";
            document.body.appendChild(element);
            element.click();
        }).catch(() => {
            this.setState({
                error: true,
                errorMessage: 'Could not generate ABAC Policy.'
            })
        })
    }

    componentDidMount() {
        ABAC_API.getABACPolicies().then(result => {
            this.setState({
                abacPolicies: Object.entries(result.data)
            });
        });
    }

    render() {
        return (
            <div className="content" style={{display: "flex", justifyContent: "center"}}>
                <Card sx={{display: "inline-block"}}>
                    <CardContent>
                        <Button variant="contained" onClick={this.saveProject} sx={{display: "flex", marginBottom: 1 , width: "100%"}}>Save
                            Project</Button>
                        <input accept=".json" id="load-project" type="file" onChange={this.loadProject}/>
                        <label htmlFor="load-project">
                            <Button variant="contained" component="span" sx={{marginBottom: 1, width: "100%"}}>Load Project</Button>
                        </label>
                        <Button variant="contained" onClick={this.generateXACMLRequest} sx={{marginBottom: 1, display: "flex", width: "100%"}}>Generate XACML Request</Button>
                        <Divider sx={{marginBottom: 1}}/>
                        <FormControl fullWidth sx={{marginBottom: 1}}>
                            <InputLabel>Policy</InputLabel>
                            <Select
                                label="Policy"
                                onChange={this.onPolicyChangeListener}
                            >
                                {
                                    this.state.abacPolicies.map((data: any) => (
                                        <MenuItem value={data[0]}>{data[0]}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={this.generateAbacPolicy} sx={{display: "flex", width: "100%"}}>Generate ABAC Policy</Button>
                    </CardContent>
                </Card>
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
        );
    }
}

export default Home