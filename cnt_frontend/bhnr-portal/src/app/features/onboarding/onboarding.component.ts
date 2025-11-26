import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

// Custom validator for Spanish Tax ID (CIF/NIF)
function taxIdValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  
  const value = control.value.toUpperCase().trim();
  if (value.length !== 9) return { taxId: 'Must be 9 characters' };
  
  const cifPattern = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/;
  const niePattern = /^[XYZ]\d{7}[A-Z]$/;
  const nifPattern = /^(\d{8})([A-Z])$/;
  
  if (!cifPattern.test(value) && !niePattern.test(value) && !nifPattern.test(value)) {
    return { taxId: 'Invalid format' };
  }
  
  return null;
}

interface WizardData {
  step1?: any;
  step2?: any;
  step3?: any;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-screen bg-white flex items-center justify-center py-8 px-4">
      <div class="w-full max-w-5xl">
        <!-- Header -->
        <div class="mb-6">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Step {{ currentStep() }} of 3</p>
            <div class="flex gap-2">
              @for (step of [1,2,3]; track step) {
                <div 
                  class="h-2 w-12 rounded-full transition-colors"
                  [ngClass]="step <= currentStep() ? 'bg-primary-600' : 'bg-slate-200'"
                ></div>
              }
            </div>
          </div>
          <h1 class="text-2xl font-bold text-slate-900">{{ stepTitle() }}</h1>
          <p class="mt-1 text-sm text-slate-600">{{ stepSubtitle() }}</p>
        </div>

        <!-- Step 1: Corporate Identity -->
        @if (currentStep() === 1) {
          <form [formGroup]="step1Form" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <!-- Tax ID -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Tax ID (CIF/NIF) *</label>
                <input
                  type="text"
                  formControlName="taxId"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  placeholder="B12345678"
                  maxlength="9"
                />
                <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError(step1Form, 'taxId')">
                  {{ getErrorMessage(step1Form, 'taxId') }}
                </p>
              </div>

              <!-- Legal Name -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Legal Name (Razón Social) *</label>
                <input
                  type="text"
                  formControlName="legalName"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  placeholder="Acme Logistics S.L."
                  maxlength="150"
                />
                <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError(step1Form, 'legalName')">
                  Legal name is required.
                </p>
              </div>

              <!-- Trade Name -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Trade Name</label>
                <input
                  type="text"
                  formControlName="tradeName"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  placeholder="Acme"
                  maxlength="100"
                />
                <p class="mt-1 text-xs text-slate-500">Optional</p>
              </div>

              <!-- Incorporation Date -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Incorporation Date *</label>
                <input
                  type="date"
                  formControlName="incorporationDate"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                />
                <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError(step1Form, 'incorporationDate')">
                  Valid date required (not future, not before 1800).
                </p>
              </div>

              <!-- Legal Nature -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Legal Nature *</label>
                <select
                  formControlName="legalNature"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                >
                  <option value="" disabled>Select</option>
                  @for (nature of legalNatures; track nature) {
                    <option [value]="nature">{{ nature }}</option>
                  }
                </select>
                <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError(step1Form, 'legalNature')">
                  Please select legal nature.
                </p>
              </div>

              <!-- Activity Code (CNAE) -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Activity Code (CNAE) *</label>
                <input
                  type="text"
                  formControlName="activityCode"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  placeholder="Search or enter 4-digit code"
                  maxlength="4"
                />
                <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError(step1Form, 'activityCode')">
                  4-digit CNAE code required.
                </p>
              </div>

              <!-- Tax Residence Country -->
              <div class="md:col-span-2">
                <label class="text-sm font-semibold text-slate-800">Tax Residence Country *</label>
                <select
                  formControlName="taxResidenceCountry"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                >
                  <option value="ES">Spain</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="PT">Portugal</option>
                  <option value="IT">Italy</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <!-- Corporate Purpose -->
              <div class="md:col-span-2">
                <label class="text-sm font-semibold text-slate-800">Corporate Purpose *</label>
                <textarea
                  formControlName="corporatePurpose"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  rows="3"
                  maxlength="500"
                  placeholder="Brief description of your company's actual activity"
                ></textarea>
                <p class="mt-1 text-xs text-slate-500">{{ step1Form.get('corporatePurpose')?.value?.length || 0 }}/500 characters</p>
                <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError(step1Form, 'corporatePurpose')">
                  Corporate purpose is required.
                </p>
              </div>
            </div>
          </form>
        }

        <!-- Step 2: Location and Contact -->
        @if (currentStep() === 2) {
          <form [formGroup]="step2Form" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <!-- Street Type -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Street Type *</label>
                <select
                  formControlName="streetType"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                >
                  <option value="" disabled>Select</option>
                  @for (type of streetTypes; track type) {
                    <option [value]="type">{{ type }}</option>
                  }
                </select>
              </div>

              <!-- Street Name -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Street Name *</label>
                <input
                  type="text"
                  formControlName="streetName"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  maxlength="100"
                />
              </div>

              <!-- Number -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Number/Block *</label>
                <input
                  type="text"
                  formControlName="streetNumber"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  maxlength="10"
                />
              </div>

              <!-- Floor/Door -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Floor/Door</label>
                <input
                  type="text"
                  formControlName="floorDoor"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  maxlength="10"
                />
              </div>

              <!-- Zip Code -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Zip/Postal Code *</label>
                <input
                  type="text"
                  formControlName="zipCode"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  maxlength="5"
                  placeholder="28001"
                />
              </div>

              <!-- City -->
              <div>
                <label class="text-sm font-semibold text-slate-800">City *</label>
                <input
                  type="text"
                  formControlName="city"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  maxlength="50"
                />
              </div>

              <!-- Province -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Province/State *</label>
                <input
                  type="text"
                  formControlName="province"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  maxlength="50"
                />
              </div>

              <!-- Contact Phone -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Contact Phone *</label>
                <input
                  type="tel"
                  formControlName="contactPhone"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  placeholder="+34 912 345 678"
                />
              </div>

              <!-- Corporate Email -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Corporate Email *</label>
                <input
                  type="email"
                  formControlName="corporateEmail"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  placeholder="contact@company.com"
                />
              </div>

              <!-- Confirm Email -->
              <div>
                <label class="text-sm font-semibold text-slate-800">Confirm Email *</label>
                <input
                  type="email"
                  formControlName="confirmEmail"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  placeholder="contact@company.com"
                />
                <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError(step2Form, 'confirmEmail')">
                  Emails must match.
                </p>
              </div>

              <!-- Website -->
              <div class="md:col-span-2">
                <label class="text-sm font-semibold text-slate-800">Website</label>
                <input
                  type="url"
                  formControlName="website"
                  class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  placeholder="https://www.company.com"
                />
                <p class="mt-1 text-xs text-slate-500">Optional</p>
              </div>
            </div>
          </form>
        }

        <!-- Step 3: Legal Representatives and KYC -->
        @if (currentStep() === 3) {
          <form [formGroup]="step3Form" class="space-y-6">
            <!-- Section A: Legal Representative -->
            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-4">Legal Representative (Main Proxy)</h3>
              <div class="grid gap-4 md:grid-cols-2">
                <!-- Document Type -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Document Type *</label>
                  <select
                    formControlName="documentType"
                    class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  >
                    <option value="" disabled>Select</option>
                    <option value="DNI">National ID (DNI)</option>
                    <option value="NIE">Alien ID (NIE)</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>

                <!-- Document Number -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Document Number *</label>
                  <input
                    type="text"
                    formControlName="documentNumber"
                    class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  />
                </div>

                <!-- First Name -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">First Name *</label>
                  <input
                    type="text"
                    formControlName="firstName"
                    class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                    maxlength="50"
                  />
                </div>

                <!-- Last Name -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Last Name *</label>
                  <input
                    type="text"
                    formControlName="lastName"
                    class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                    maxlength="50"
                  />
                </div>

                <!-- Role/Position -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Role/Position *</label>
                  <select
                    formControlName="role"
                    class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  >
                    <option value="" disabled>Select</option>
                    @for (role of roles; track role) {
                      <option [value]="role">{{ role }}</option>
                    }
                  </select>
                </div>

                <!-- PEP -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Politically Exposed Person (PEP)? *</label>
                  <div class="mt-1.5 flex gap-4">
                    <label class="flex items-center gap-2">
                      <input type="radio" formControlName="isPEP" [value]="true" class="h-4 w-4 text-primary-600" />
                      <span class="text-sm">Yes</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="radio" formControlName="isPEP" [value]="false" class="h-4 w-4 text-primary-600" />
                      <span class="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- File Uploads -->
              <div class="mt-4 space-y-3">
                <div>
                  <label class="text-sm font-semibold text-slate-800">Attach ID (Front) * - Max 5MB (.jpg, .png, .pdf)</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    class="mt-1.5 w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
                <div>
                  <label class="text-sm font-semibold text-slate-800">Attach Powers of Attorney * - Max 10MB (.pdf)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    class="mt-1.5 w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
                <div>
                  <label class="text-sm font-semibold text-slate-800">Deed of Incorporation * - Max 15MB (.pdf)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    class="mt-1.5 w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              </div>
            </div>

            <!-- Section B: Economic Data -->
            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-4">Economic Data and Operations</h3>
              <div class="grid gap-4 md:grid-cols-2">
                <!-- Estimated Annual Turnover -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Estimated Annual Turnover (€) *</label>
                  <input
                    type="number"
                    formControlName="estimatedTurnover"
                    class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                    placeholder="1000000.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <!-- Source of Funds -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Source of Funds *</label>
                  <select
                    formControlName="sourceOfFunds"
                    class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  >
                    <option value="" disabled>Select</option>
                    <option value="BUSINESS">Business Activity</option>
                    <option value="CAPITAL">Capital Increase</option>
                    <option value="GRANTS">Grants</option>
                    <option value="LOANS">Loans</option>
                  </select>
                </div>

                <!-- Main Currency -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Main Currency *</label>
                  <select
                    formControlName="mainCurrency"
                    class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  >
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                <!-- Tax Havens -->
                <div>
                  <label class="text-sm font-semibold text-slate-800">Operations with Tax Havens? *</label>
                  <div class="mt-1.5 flex gap-4">
                    <label class="flex items-center gap-2">
                      <input type="radio" formControlName="taxHavens" [value]="true" class="h-4 w-4 text-primary-600" />
                      <span class="text-sm">Yes</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="radio" formControlName="taxHavens" [value]="false" class="h-4 w-4 text-primary-600" />
                      <span class="text-sm">No</span>
                    </label>
                  </div>
                </div>

                <!-- Purpose of Relationship -->
                <div class="md:col-span-2">
                  <label class="text-sm font-semibold text-slate-800">Purpose of Relationship * (Select at least one)</label>
                  <div class="mt-2 grid grid-cols-2 gap-3">
                    @for (purpose of purposeOptions; track purpose) {
                      <label class="flex items-center gap-2">
                        <input type="checkbox" [value]="purpose" class="h-4 w-4 rounded text-primary-600" />
                        <span class="text-sm">{{ purpose }}</span>
                      </label>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Legal Declarations -->
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <label class="flex items-start gap-3 text-xs text-slate-700">
                <input
                  type="checkbox"
                  formControlName="declareData"
                  class="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600"
                />
                <span>
                  I declare that the provided data is true and I am the beneficial owner of the activity.
                </span>
              </label>
              <label class="flex items-start gap-3 text-xs text-slate-700">
                <input
                  type="checkbox"
                  formControlName="acceptPrivacy"
                  class="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600"
                />
                <span>
                  I accept the <a href="#" class="font-semibold text-primary-700 hover:underline">Privacy Policy</a> and Data Processing Agreement of Banca Henar (BHNR).
                </span>
              </label>
            </div>
          </form>
        }

        <!-- Navigation Buttons -->
        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div class="flex gap-3">
            @if (currentStep() > 1) {
              <button
                type="button"
                (click)="goBack()"
                class="rounded-2xl border border-slate-300 px-6 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
            }
            <button
              type="button"
              (click)="handleCancel()"
              class="rounded-2xl border border-slate-300 px-6 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {{ currentStep() === 1 ? 'Cancel' : 'Save Draft' }}
            </button>
          </div>
          <button
            type="button"
            (click)="goNext()"
            [disabled]="!isCurrentStepValid() || isSubmitting()"
            class="rounded-2xl bg-primary-600 px-6 py-2.5 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {{ currentStep() === 3 ? 'Finalize and Sign Contract' : 'Continue' }}
          </button>
        </div>
      </div>
    </section>
  `,
})
export class OnboardingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly currentStep = signal(1);
  readonly isSubmitting = signal(false);
  readonly wizardData = signal<WizardData>({});

  readonly step1Form = this.buildStep1Form();
  readonly step2Form = this.buildStep2Form();
  readonly step3Form = this.buildStep3Form();

  readonly stepTitle = computed(() => {
    const titles = ['Corporate Identity and Activity', 'Location and Contact', 'Legal Representatives and Economic Data'];
    return titles[this.currentStep() - 1] || '';
  });

  readonly stepSubtitle = computed(() => {
    const subtitles = [
      'Legally identify the company and its economic nature.',
      'Establish the fiscal/operational headquarters and communication channels.',
      'Identify the signer (Representative) and financial profile for AML prevention.'
    ];
    return subtitles[this.currentStep() - 1] || '';
  });

  readonly legalNatures = ['S.A.', 'S.L.', 'Cooperative', 'Joint Venture', 'Association', 'Other'];
  readonly streetTypes = ['Street', 'Avenue', 'Square', 'Boulevard', 'Industrial Estate', 'Plaza', 'Road'];
  readonly roles = ['Sole Administrator', 'CEO', 'Joint Proxy', 'Solidary Proxy'];
  readonly purposeOptions = ['Current Account', 'POS', 'Payroll Management', 'Financing', 'Investment'];

  private buildStep1Form(): FormGroup {
    return this.fb.nonNullable.group({
      taxId: ['', [Validators.required, taxIdValidator]],
      legalName: ['', [Validators.required, Validators.maxLength(150)]],
      tradeName: ['', [Validators.maxLength(100)]],
      incorporationDate: ['', [Validators.required]],
      legalNature: ['', [Validators.required]],
      activityCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      taxResidenceCountry: ['ES', [Validators.required]],
      corporatePurpose: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  private buildStep2Form(): FormGroup {
    return this.fb.nonNullable.group({
      streetType: ['', [Validators.required]],
      streetName: ['', [Validators.required, Validators.maxLength(100)]],
      streetNumber: ['', [Validators.required, Validators.maxLength(10)]],
      floorDoor: [''],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      province: ['', [Validators.required, Validators.maxLength(50)]],
      contactPhone: ['', [Validators.required]],
      corporateEmail: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      website: [''],
    }, {
      validators: this.emailMatchValidator
    });
  }

  private buildStep3Form(): FormGroup {
    return this.fb.nonNullable.group({
      documentType: ['', [Validators.required]],
      documentNumber: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      role: ['', [Validators.required]],
      isPEP: [false, [Validators.required]],
      estimatedTurnover: [0, [Validators.required, Validators.min(0)]],
      sourceOfFunds: ['', [Validators.required]],
      mainCurrency: ['EUR', [Validators.required]],
      taxHavens: [false, [Validators.required]],
      declareData: [false, [Validators.requiredTrue]],
      acceptPrivacy: [false, [Validators.requiredTrue]],
    });
  }

  private emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.get('corporateEmail')?.value;
    const confirm = control.get('confirmEmail')?.value;
    return email === confirm ? null : { emailMismatch: true };
  }

  shouldShowError(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (!control?.errors) return '';
    
    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Invalid email format';
    if (control.errors['pattern']) return 'Invalid format';
    if (control.errors['taxId']) return control.errors['taxId'];
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    
    return 'Invalid value';
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep()) {
      case 1: return this.step1Form.valid;
      case 2: return this.step2Form.valid;
      case 3: return this.step3Form.valid;
      default: return false;
    }
  }

  goNext(): void {
    const step = this.currentStep();
    
    if (step === 1) {
      this.step1Form.markAllAsTouched();
      if (this.step1Form.valid) {
        this.wizardData.update(data => ({ ...data, step1: this.step1Form.getRawValue() }));
        this.currentStep.set(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (step === 2) {
      this.step2Form.markAllAsTouched();
      if (this.step2Form.valid) {
        this.wizardData.update(data => ({ ...data, step2: this.step2Form.getRawValue() }));
        this.currentStep.set(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (step === 3) {
      this.step3Form.markAllAsTouched();
      if (this.step3Form.valid) {
        this.handleFinalSubmit();
      }
    }
  }

  goBack(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async handleFinalSubmit(): Promise<void> {
    this.isSubmitting.set(true);
    
    try {
      const finalData = {
        ...this.wizardData(),
        step3: this.step3Form.getRawValue()
      };
      
      console.log('Complete wizard data:', finalData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success or dashboard
      await this.router.navigate(['/app/dashboard']);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  handleCancel(): void {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      void this.router.navigate(['/home']);
    }
  }
}

