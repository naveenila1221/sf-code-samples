import { LightningElement, wire, api } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import CONTACT_OBJECT from "@salesforce/schema/Contact";
import {
  getRecord,
  getFieldValue,
  getFieldDisplayValue
} from "lightning/uiRecordApi";
import { loadScript } from "lightning/platformResourceLoader";
import JS_PDF from "@salesforce/resourceUrl/JSPdf";
export default class IndividualApplicationPdfExport extends LightningElement {
  @api recordId;
  docTableHeader = ["col1", "col2", "col3", "col4"];
  jsPDFInitialized = false;
  recordInfo = {};

  sObjsInfo = {};

  cntxtSObjRelTosObjNm = {
    Contact: "Contact",
    Account: "Account"
  };
  @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
  contactInfoHandler({ error, data }) {
    if (data) {
      this.sObjsInfo[data.apiName] = data;
    }
  }
  @wire(getObjectInfo, { objectApiName: "Account" })
  accountInfoHandler({ error, data }) {
    if (data) {
      this.sObjsInfo[data.apiName] = data;
    }
  }

  fields = [
    "Contact.Name",
    "Contact.FirstName",
    "Contact.LastName",
    "Contact.MobilePhone",
    "Contact.Email",
    "Contact.Account.Name",
    "Contact.Account.Industry"
  ];
  renderedCallback() {
    if (!this.jsPDFInitialized) {
      this.jsPDFInitialized = true;
      loadScript(this, JS_PDF)
        .then(() => {})
        .catch((error) => {
          console.error("Error loading jsPDF library", error);
        });
    }
  }
  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  recordInfoHandler({ error, data }) {
    this.recordInfo = data;
    console.log("$$$ this.recordInfo", this.recordInfo);
  }

  handleGeneratePDF() {
    if (this.jsPDFInitialized) {
      // Make sure to correctly reference the loaded jsPDF library.
      const doc = new window.jspdf.jsPDF();
      let config = {
        autoSize: false,
        printHeaders: false
      };
      // Add content to the PDF.
      doc.text("Hello PDF!", 10, 10);
      doc.table(10, 10, this.generateTableData(), this.docTableHeader, config);
      // Save the PDF.
      doc.save(this.pdfName + ".pdf");
    } else {
      console.error("jsPDF library not initialized");
    }
  }

  get pdfName() {
    return "Sample Record";
  }

  generateTableData() {
    const headersLength = this.docTableHeader.length;
    let data = [];
    let cntr = 0;
    let obj = {};
    let colNm;
    this.fields.forEach((fld) => {
      colNm = this.docTableHeader[cntr];
      obj[colNm] = this.getFieldLabel(fld);
      cntr++;
      colNm = this.docTableHeader[cntr];
      obj[colNm] = this.getFieldValue(fld);
      cntr++;
      if (cntr === headersLength) {
        data.push(obj);
        obj = {};
        cntr = 0;
      }
    });
    console.log("$$$ data ", data);
    return data;
  }

  getFieldValue(fld) {
    return (
      getFieldValue(this.recordInfo, fld) ||
      getFieldDisplayValue(this.recordInfo, fld) ||
      "-"
    );
  }
  getFieldLabel(fld) {
    try {
      let fldParts = fld.split(".");
      let sObjectRelNm = fldParts[fldParts.length - 2];
      let fldApiNm = fldParts[fldParts.length - 1];
      let sObjNm = this.cntxtSObjRelTosObjNm[sObjectRelNm];
      let sObjInfo = this.sObjsInfo[sObjNm];
      return sObjInfo?.fields[fldApiNm]?.label || "-";
    } catch (e) {
      return fld;
    }
  }
}
