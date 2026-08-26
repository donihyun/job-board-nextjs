import mongoose from "mongoose";

const visaSchema = new mongoose.Schema({
   country: { type: String, required: true },
   name: { type: String, required: true }, 
   visa_type: { type: String, required: true },
   duration: { type: String, default: "" },
   duration_normalized: {
      min_months: { type: Number, default: null, min: 0 },
      max_months: { type: Number, default: null, min: 0 },
      basis: { type: String, enum: ["fixed", "course", "contract", "permit", "varies"], default: "varies" }
   },
   age_normalized: { min_age: { type: Number, default: null }, max_age: { type: Number, default: null }, varies: { type: Boolean, default: false } },
   korean_passport: { type: String, enum: ["Eligible", "Ineligible", "Conditional"], default: "Conditional" },
   work_hours_normalized: { type: { type: String, enum: ["Unlimited", "Limited", "Conditional"] }, max_hours_per_week: { type: Number, default: null } },
   financial_normalized: { status: { type: String, enum: ["Required", "Not required", "Unknown"] }, amount: { type: Number, default: null }, currency: { type: String, default: null }, period: { type: String, enum: ["Total", "Monthly", null], default: null } },
   processing_normalized: { max_days: { type: Number, default: null }, status: { type: String, enum: ["Known", "Unknown"], default: "Unknown" } },
   application_fee_normalized: { status: { type: String, enum: ["Verified", "Varies or not numeric", "Not published on source", "Fetch failed"] }, amount: { type: Number, default: null }, currency: { type: String, default: null } },
   metadata_audit: {
      checked_at: { type: String, default: "" }, source_http_status: { type: Number, default: 0 },
      financial: { type: String, default: "Not published on source" }, fee: { type: String, default: "Not published on source" }, processing: { type: String, default: "Not published on source" }
   },
   pr_relevance: { type: String, enum: ["Direct pathway", "Residence counts", "Residence partly counts", "Work experience", "Long residence", "Does not count", "Conditional"], default: "Conditional" },
   pr_relevance_note: { type: String, default: "" },
   job_offer_required: { type: String, enum: ["Yes", "No", "Varies"], default: "No" },
   job_offer_note: { type: String, default: "" },
   processing_time: { type: String, default: "" },
   application_process: { type: String, default: "" },
   official_link: { type: String, default: "" },
   family_allowed: { type: String, default: "" },
   financial_proof_required: { type: String, default: "" },
   permanent_residency_pathway: { type: String, default: "" }
}); 

const Visa = mongoose.models.Visa || mongoose.model("Visa", visaSchema);

export default Visa;
