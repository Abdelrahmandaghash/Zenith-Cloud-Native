import os
import sys
import glob
import py_compile
import json

print("=== ZENITH Platform Architecture Verification ===")

# 1. Verify Python files
py_files = glob.glob("services/**/*.py", recursive=True)
print(f"Found {len(py_files)} Python files:")
for f in py_files:
    py_compile.compile(f, doraise=True)
    print(f"  [OK] Syntax clean: {f}")

# 2. Verify Sample Data
with open("frontend/src/data/sampleData.js", "r", encoding="utf-8") as f:
    sample_content = f.read()
    assert "CATEGORIES" in sample_content
    assert "PRODUCTS" in sample_content
    assert "TOURS" in sample_content
    print("  [OK] Frontend sample data loaded successfully")

# 3. Verify Dockerfiles & Nginx Config
assert os.path.exists("frontend/Dockerfile")
assert os.path.exists("services/product-service/Dockerfile")
assert os.path.exists("services/tour-service/Dockerfile")
assert os.path.exists("services/order-service/Dockerfile")
assert os.path.exists("nginx/nginx.conf")
assert os.path.exists("docker-compose.yml")
assert os.path.exists("monitoring/prometheus/prometheus.yml")
assert os.path.exists("monitoring/grafana/dashboards/zenith-dashboard.json")
assert os.path.exists("jenkins/Jenkinsfile")
assert os.path.exists("terraform/README.md")
assert os.path.exists("README.md")
print("  [OK] All Dockerfiles, Nginx configs, monitoring files, and CI/CD pipelines verified!")

# 4. Verify Grafana JSON schema
with open("monitoring/grafana/dashboards/zenith-dashboard.json", "r", encoding="utf-8") as f:
    dash = json.load(f)
    assert len(dash.get("panels", [])) == 6
    print(f"  [OK] Grafana dashboard verified with {len(dash['panels'])} monitoring panels")

print("\nAll ZENITH platform components successfully verified!")
