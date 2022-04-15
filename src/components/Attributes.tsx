import React from "react";
import {
    Button, Card, CardContent, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Fab, FormControlLabel,
    FormGroup,
    TextField
} from "@mui/material";
import {Attribute} from "../api/model/attribute";
import {DataGrid} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

class Attributes extends React.Component<any, any> {
    private readonly deleteAttribute: Function;
    private readonly addAttribute: Function;

    constructor(props: any) {
        super(props);
        this.state = {
            dialog: false,
            attributeId: "",
            issuer: "",
            includeInResult: false,
            attributeValues: ""
        }
        this.deleteAttribute = this.props.deleteAttribute.bind(this);
        this.addAttribute = this.props.addAttribute.bind(this);
    }

    private openEdit = (attributeId: string, issuer: string, includeInResult: boolean, attributeValues: string) => {
        this.setState({
            dialog: true,
            attributeId: attributeId,
            issuer: issuer,
            includeInResult: includeInResult,
            attributeValues: attributeValues
        });
    }

    private openAdd = () => {
        this.setState({dialog: true});
    }

    private closeDialog = () => {
        this.setState({
            dialog: false,
            attributeId: "",
            issuer: "",
            includeInResult: false,
            attributeValues: ""
        });
    }

    private onAttributeIdChangeListener = (event: any) => {
        this.setState({attributeId: event.target.value});
    }

    private onIssuerChangeListener = (event: any) => {
        this.setState({issuer: event.target.value});
    }

    private onIncludeInResultChangeListener = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({includeInResult: event.target.checked});
    }

    private onAttributeValuesChangeListener = (event: any) => {
        this.setState({attributeValues: event.target.value});
    }

    private delete = () => {
        this.deleteAttribute(this.state.attributeId);
        this.closeDialog();
    }

    private add = () => {
        this.addAttribute(this.state.attributeId, this.state.issuer, this.state.includeInResult, this.state.attributeValues);
        this.closeDialog();
    }

    render() {
        return (
            <div>
                <Card>
                    <CardContent>
                        <DataGrid
                            autoHeight={true}
                            hideFooter
                            columns={[
                                {field: 'attributeId', headerName: 'Attribute ID', flex: 1},
                                {field: 'issuer', headerName: 'Issuer', flex: 1},
                                {field: 'includeInResult', headerName: 'Include In Result', flex: 1}
                            ]}
                            rows={
                                this.props.attributes.map((data: any) => {
                                    return {
                                        id: data[0],
                                        attributeId: data[0],
                                        issuer: (data[1] as Attribute).issuer,
                                        includeInResult: (data[1] as Attribute).includeInResult
                                    }
                                })
                            }
                            onSelectionModelChange={(selectionModel, details) => {
                                if (this.props.attributes.length > 0) {
                                    let attribute = this.props.attributes.filter((data: any) => {
                                        if (data[0] == selectionModel[0]) {
                                            return data;
                                        }
                                    });

                                    if (attribute.length > 0) {
                                        attribute = attribute[0][1] as Attribute;
                                        const attributeValues = attribute.attributeValues.map((data: any) => {
                                            return data.content;
                                        })[0]?.join(',')
                                        this.openEdit(attribute.attributeId,
                                            attribute.issuer,
                                            attribute.includeInResult,
                                            attributeValues ? attributeValues : "")
                                    }
                                }
                            }}
                        />
                    </CardContent>
                </Card>
                <Fab color="primary" aria-label="add" onClick={this.openAdd} size="medium"
                     sx={{float: 'right', margin: '16px'}}>
                    <AddIcon/>
                </Fab>
                <Dialog open={this.state.dialog} onClose={this.closeDialog}>
                    <DialogTitle>
                        {
                            this.props.attributes.filter((data: any) => {
                                if (data[0] == this.state.attributeId) {
                                    return data
                                }
                            }).length > 0 ? "Edit " + this.state.attributeId : "New Attribute"
                        }
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Attribute ID"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={this.state.attributeId}
                            onChange={this.onAttributeIdChangeListener}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Issuer"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={this.state.issuer}
                            onChange={this.onIssuerChangeListener}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Attribute values"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={this.state.attributeValues}
                            onChange={this.onAttributeValuesChangeListener}
                        />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={this.onIncludeInResultChangeListener}
                                                                 checked={this.state.includeInResult}/>}
                                              label="Include in result"/>
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button color="success" variant="contained" onClick={this.add}>{
                            this.props.attributes.filter((data: any) => {
                                if (data[0] == this.state.attributeId) {
                                    return data
                                }
                            }).length > 0 ? "Edit" : "Add"
                        }</Button>
                        <Button color="error" variant="contained" sx={{
                            display:
                                this.props.attributes.filter((data: any) => {
                                    if (data[0] == this.state.attributeId) {
                                        return data
                                    }
                                }).length > 0 ? "" : "none"
                        }} onClick={this.delete}>Delete</Button>
                        <Button onClick={this.closeDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default Attributes