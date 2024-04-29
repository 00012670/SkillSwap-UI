import { FormControl, FormGroup } from "@angular/forms";

export default class ValidateForm {
  static validateAllFormFileds(formGroup: FormGroup) {  // Define a static method named validateAllFormFileds that takes a FormGroup as a parameter
    Object.keys(formGroup.controls).forEach(field => {   // Get all the keys of the formGroup.controls object and iterate over them
      const control = formGroup.get(field);           // Get the control object associated with the current field
      if (control instanceof FormControl) {           // If the control object is an instance of FormControl
        // Mark the control as dirty. This means the user has interacted with this control.
        // The onlySelf option means only this control is marked as dirty, not any of its ancestors.
        control?.markAsDirty({ onlySelf: true })
      } else if (control instanceof FormGroup) {     // If the control object is an instance of FormGroup
        this.validateAllFormFileds(control)          // Recursively call the validateAllFormFileds method to mark all controls in the nested FormGroup as dirty
      }
    })
  }
}
