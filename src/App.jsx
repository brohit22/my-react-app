import React, { useState } from "react";

// Mock data for schools
const initialSchools = [
  {
    id: 1,
    name: "Springfield Elementary",
    avgRating: 4.2,
    state: "IL",
    city: "Springfield",
    fees: 5000,
    verifiedReviews: 12,
    ratingBreakdown: { 5: 67, 4: 11, 3: 22, 2: 0, 1: 0 },
    categoryRatings: {
      academic: 4.5,
      faculty: 4.0,
      infrastructure: 3.5,
      placement: 4.3,
    },
  },
  // ... (other schools)
];

// Mock data for reviews
const initialReviews = [
  {
    id: 1,
    schoolId: 1,
    author: "John D.",
    grade: "5th",
    division: "A",
    rating: 4,
    comment: "Great teachers and supportive environment.",
  },
  // ... (other reviews)
];

const StarRating = ({ rating }) => {
  return (
    <div style={{ display: "flex" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= rating ? "#facc15" : "#d1d5db" }}>
          ★
        </span>
      ))}
    </div>
  );
};

const ProgressBar = ({ percentage }) => (
  <div style={{ width: "100%", backgroundColor: "#e5e7eb", borderRadius: "9999px", height: "10px" }}>
    <div
      style={{
        width: `${Math.max(0, Math.min(100, percentage || 0))}%`,
        backgroundColor: "#facc15",
        height: "100%",
        borderRadius: "9999px",
      }}
    ></div>
  </div>
);

const DetailedRating = ({ school }) => {
  const { avgRating, verifiedReviews, ratingBreakdown, categoryRatings } = school;

  return (
    <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "32px", fontWeight: "bold", marginRight: "8px" }}>{avgRating.toFixed(1)}</span>
        <div>
          <StarRating rating={Math.round(avgRating)} />
          <div style={{ fontSize: "14px", color: "#16a34a" }}>({verifiedReviews} Verified Reviews)</div>
        </div>
      </div>
      <a href="#" style={{ color: "#2563eb", textDecoration: "underline", marginBottom: "8px", display: "block" }}>
        Write a College Review
      </a>
      <div style={{ fontSize: "12px", color: "#16a34a", marginBottom: "16px" }}>
        & Win Monthly Prizes Up to ₹1 Lakh/-*
      </div>

      {/* Rating Breakdown */}
      <div style={{ marginBottom: "24px" }}>
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ width: "16px", marginRight: "8px" }}>{stars}</span>
            <span style={{ color: "#facc15", marginRight: "8px" }}>★</span>
            <ProgressBar percentage={ratingBreakdown[stars] || 0} />
            <span style={{ marginLeft: "8px", fontSize: "14px" }}>({ratingBreakdown[stars] || 0}%)</span>
          </div>
        ))}
      </div>

      {/* Category Ratings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { name: "Academic", icon: "🎓", rating: categoryRatings.academic },
          { name: "Faculty", icon: "👥", rating: categoryRatings.faculty },
          { name: "Infrastructure", icon: "🏢", rating: categoryRatings.infrastructure },
          { name: "Placement", icon: "💼", rating: categoryRatings.placement },
        ].map(({ name, icon, rating }) => (
          <div key={name} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "32px", marginRight: "8px" }}>{icon}</span>
            <div>
              <div style={{ fontSize: "14px" }}>{name}</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "4px" }}>{rating.toFixed(1)}</span>
                <span style={{ color: "#facc15" }}>★</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function SchoolReviewPlatform() {
  const [schools, setSchools] = useState(initialSchools);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ state: "all", city: "all", fees: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.state === "all" || school.state === filters.state) &&
      (filters.city === "all" || school.city === filters.city) &&
      (filters.fees === "" || school.fees <= parseInt(filters.fees))
  );

  const schoolReviews = reviews.filter((review) => review.schoolId === selectedSchool?.id);

  const handleSubmitReview = (event) => {
    event.preventDefault();
    const form = event.target;
    const newReview = {
      id: reviews.length + 1,
      schoolId: selectedSchool.id,
      author: form.author.value,
      grade: form.grade.value,
      division: form.division.value,
      rating: parseInt(form.rating.value),
      comment: form.comment.value,
    };
    setReviews([...reviews, newReview]);
    form.reset();
    setShowReviewForm(false);
  };

  const handleAddSchool = (event) => {
    event.preventDefault();
    const form = event.target;
    const newSchool = {
      id: schools.length + 1,
      name: form.schoolName.value,
      avgRating: 0,
      state: form.state.value,
      city: form.city.value,
      fees: parseInt(form.fees.value),
      verifiedReviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      categoryRatings: { academic: 0, faculty: 0, infrastructure: 0, placement: 0 },
    };
    setSchools([...schools, newSchool]);
    setSearchTerm(newSchool.name);
  };

  const uniqueStates = [...new Set(schools.map((school) => school.state))];
  const uniqueCities = [...new Set(schools.map((school) => school.city))];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>School Review Platform</h1>
      </div>

      {/* School search and filters */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{ position: "relative", flexGrow: 1 }}>
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "32px", width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
            />
            <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🔍</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <select
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db", width: "180px" }}
          >
            <option value="all">All States</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db", width: "180px" }}
          >
            <option value="all">All Cities</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Max fees"
            value={filters.fees}
            onChange={(e) => setFilters({ ...filters, fees: e.target.value })}
            style={{ width: "180px", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
          />
        </div>
      </div>

      {/* School list */}
      <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {filteredSchools.map((school) => (
          <div key={school.id} style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ padding: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>{school.name}</h2>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <StarRating rating={Math.round(school.avgRating)} />
                <span style={{ marginLeft: "8px" }}>{school.avgRating.toFixed(1)}</span>
              </div>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
                {school.city}, {school.state} - ${school.fees}/year
              </p>
              <button
                onClick={() => setSelectedSchool(school)}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
        {filteredSchools.length === 0 && (
          <div>
            <button
              onClick={() => {
                const schoolName = prompt("Enter School Name:");
                if (schoolName) {
                  const state = prompt("Enter State:");
                  const city = prompt("Enter City:");
                  const fees = prompt("Enter Yearly Fees:");
                  if (state && city && fees) {
                    handleAddSchool({
                      preventDefault: () => {},
                      target: {
                        schoolName: { value: schoolName },
                        state: { value: state },
                        city: { value: city },
                        fees: { value: fees },
                      },
                    });
                  }
                }
              }}
              style={{
                backgroundColor: "#e5e7eb",
                padding: "32px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>➕</div>
              Add New School
            </button>
          </div>
        )}
      </div>

      {/* Selected school details */}
      {selectedSchool && (
        <div style={{ marginTop: "32px" }}>
          <DetailedRating school={selectedSchool} />
          <div style={{ marginTop: "32px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
              Reviews for {selectedSchool.name}
            </h2>
            {schoolReviews.length > 0 ? (
              <div style={{ marginBottom: "32px" }}>
                {schoolReviews.map((review) => (
                  <div key={review.id} style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <span style={{ fontWeight: "500" }}>{review.author}</span>
                        <span style={{ fontSize: "14px", color: "#6b7280", marginLeft: "8px" }}>
                          Grade: {review.grade}, Division: {review.division}
                        </span>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p style={{ fontSize: "14px" }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>No reviews yet. Be the first to review!</p>
            )}
            {!showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Write a Review
              </button>
            ) : (
              <form onSubmit={handleSubmitReview} style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Submit a Review</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label htmlFor="author" style={{ display: "block", marginBottom: "4px" }}>
                      Your Name
                    </label>
                    <input
                      id="author"
                      name="author"
                      required
                      style={{ padding: "8px", width: "100%", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    />
                  </div>
                  <div>
                    <label htmlFor="rating" style={{ display: "block", marginBottom: "4px" }}>
                      Rating
                    </label>
                    <select
                      name="rating"
                      required
                      style={{ padding: "8px", width: "100%", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    >
                      <option value="">Select a rating</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} Star{rating !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="grade" style={{ display: "block", marginBottom: "4px" }}>
                      Grade
                    </label>
                    <input
                      id="grade"
                      name="grade"
                      required
                      style={{ padding: "8px", width: "100%", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    />
                  </div>
                  <div>
                    <label htmlFor="division" style={{ display: "block", marginBottom: "4px" }}>
                      Division
                    </label>
                    <input
                      id="division"
                      name="division"
                      required
                      style={{ padding: "8px", width: "100%", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: "16px" }}>
                  <label htmlFor="comment" style={{ display: "block", marginBottom: "4px" }}>
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    required
                    style={{
                      padding: "8px",
                      width: "100%",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      height: "100px",
                    }}
                  ></textarea>
                </div>
                <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    style={{
                      backgroundColor: "#e5e7eb",
                      color: "#000",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolReviewPlatform;
