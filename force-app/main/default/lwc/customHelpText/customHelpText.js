import { LightningElement, api } from "lwc";

export default class CustomHelpText extends LightningElement {
  @api popoverBody = "";
  handleMouseOver() {
    this.toggleTooltip(false);
  }
  handleMouseOut() {
    this.toggleTooltip();
  }
  toggleTooltip(isHide = true) {
    const popoverDiv = this.template.querySelector('.slds-popover');
    if(isHide) {
      popoverDiv.classList.add('slds-hide');
    } else {
      popoverDiv.classList.remove('slds-hide');
    }
  }
}