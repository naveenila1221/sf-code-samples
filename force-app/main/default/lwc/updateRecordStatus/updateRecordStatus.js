import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { updateRecord, getRecordNotifyChange } from 'lightning/uiRecordApi';

export default class UpdateRecordStatus extends LightningElement {
    @api recordId;
    @api 
    async invoke () { 
        const fields = {Id:this.recordId};
        fields["Industry"] = "";
        updateRecord({fields})
        .then(res=>{
            getRecordNotifyChange([{recordId : this.recordId}]);
        }).catch(e=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error",
                    message: 'Error occoured while updating record',
                    variant: "error"
                })
            );
        });
    } 


}