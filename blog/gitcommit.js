  
    const GITHUB_REPO = "nashdba/nashdba.github.io"; // Change thisnashdba.github.io/"; // Change this
    const FILE_PATH = "blog/blog.json"; // Relative to repo root

    fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?path=${FILE_PATH}`)
      .then(res => res.json())
      .then(commits => {
        if (commits && commits.length > 0) {
          const date = new Date(commits[0].commit.committer.date);
          document.getElementById("last-updated").textContent =
            "Last updated: " + date.toLocaleString();
        } else {
          document.getElementById("last-updated").textContent =
            "No update history found.";
        }
      })
      .catch(error => {
        console.error("Error fetching commit data:", error);
        document.getElementById("last-updated").textContent =
          "Could not fetch update time.";
      });
