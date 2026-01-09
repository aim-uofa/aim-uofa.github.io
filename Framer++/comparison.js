// Configuration for the comparison table
const comparisonConfig = {
  // Define the methods to compare (in order they should appear in the table)
//   AMT[30], 309
// RIFE[20], FLAVR[26], and FILM[43], as well as gener- 310
// ative video interpolation methods, such as LDMVFI[13], 311
// DynamiCrafter[53], SVDKFI[51], and Framer[49].
  methods: [
    { id: "amt", name: "AMT" },
    { id: "rife", name: "RIFE" },
    { id: "flavr", name: "FLAVR" },
    { id: "film", name: "FILM" },
    { id: "dynamicrafter", name: "DynamiCrafter" },
    { id: "svdkfi", name: "SVDKFI" },
    { id: "framer", name: "Framer" },
    { id: "ours_f17", name: "Framer++" }
  ],
  
  // The test cases/results to show (each becomes a row)
  results: [
    { id: "0001" },
    { id: "2c8d98c5f43c7d6eba8a3d0bfbc494a5" },
    { id: "6b68181c4ad17382a3e1027dfdf80017" },
    { id: "dc03ac96e082fa0b0c23fd10f695870b" },
    { id: "de2fa2f62103a278c7c605d99005ef89" },
    { id: "fdea467348a14c83068586cceac05759" }
  ]
};

// Function to generate the comparison table
function generateComparisonTable() {
  const container = document.getElementById('comparison-table-container');
  if (!container) return;
  
  // Create table HTML
  let tableHTML = `
    <table class="comparison-table">
      <thead>
        <tr>
          ${comparisonConfig.methods.map(method => `<th>${method.name}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
  `;
  
  // Add rows for each result case
  comparisonConfig.results.forEach(result => {
    tableHTML += `
      <tr>
        ${comparisonConfig.methods.map(method => `
          <td class="result-cell ${method.id === 'ours_f17' ? 'ours-cell' : ''}">
            <div class="comparison-video-container">
              <video autoplay loop muted playsinline controls>
                <source src="./comparisons/${method.id}/${result.id}.mp4" type="video/mp4">
              </video>
            </div>
          </td>
        `).join('')}
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
  `;
  
  container.innerHTML = tableHTML;
}

// Initialize the comparison table when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  generateComparisonTable();
}); 