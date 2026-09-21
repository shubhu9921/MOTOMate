import os
import re
import csv

def extract_apis(backend_dir):
    apis = []
    
    # Regex patterns
    class_mapping_pattern = re.compile(r'@RequestMapping\s*\(\s*"?([^"\)]+)"?\s*\)')
    method_mapping_pattern = re.compile(r'@(GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping)\s*\(\s*"?([^"\)]*)"?\s*\)')
    request_body_pattern = re.compile(r'@RequestBody\s+([A-Za-z0-9_<>]+)\s+([A-Za-z0-9_]+)')
    response_pattern = re.compile(r'public\s+(?:ResponseEntity<)?([A-Za-z0-9_<>]+)(?:>)?\s+([A-Za-z0-9_]+)\s*\(')
    
    for root, dirs, files in os.walk(backend_dir):
        for file in files:
            if file.endswith("Controller.java"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Find class level mapping
                    base_url = ""
                    class_mapping_match = class_mapping_pattern.search(content)
                    if class_mapping_match:
                        base_url = class_mapping_match.group(1).strip()
                    
                    # Split by methods roughly (this is naive but works for standard formatting)
                    lines = content.split('\n')
                    
                    current_method_type = ""
                    current_endpoint = ""
                    current_response = ""
                    current_request_body = ""
                    
                    for i, line in enumerate(lines):
                        mapping_match = method_mapping_pattern.search(line)
                        if mapping_match:
                            method_type = mapping_match.group(1).replace("Mapping", "").upper()
                            endpoint = mapping_match.group(2).strip()
                            
                            # Combine base_url and endpoint properly
                            full_url = base_url
                            if endpoint:
                                if not full_url.endswith('/') and not endpoint.startswith('/'):
                                    full_url += '/'
                                elif full_url.endswith('/') and endpoint.startswith('/'):
                                    endpoint = endpoint[1:]
                                full_url += endpoint
                            
                            # Look ahead for method signature to get response and request body
                            response_type = "Void"
                            request_body = "None"
                            
                            for j in range(i+1, min(i+5, len(lines))):
                                sig_line = lines[j]
                                if "public" in sig_line:
                                    resp_match = response_pattern.search(sig_line)
                                    if resp_match:
                                        response_type = resp_match.group(1)
                                    
                                    req_match = request_body_pattern.search(sig_line)
                                    if req_match:
                                        request_body = req_match.group(1)
                                    break
                                
                            apis.append({
                                "Base URL": base_url if base_url else "/",
                                "API (Endpoint)": full_url,
                                "Method": method_type,
                                "Request Data / Body": request_body,
                                "Response Data": response_type,
                                "Status": "200 OK (Expected)"
                            })
                            
    return apis

if __name__ == "__main__":
    backend_dir = r"d:\New folder\MotorMate\backend\src\main\java"
    apis = extract_apis(backend_dir)
    
    csv_file = r"d:\New folder\MotorMate\api_documentation.csv"
    
    with open(csv_file, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Base URL', 'API (Endpoint)', 'Method', 'Request Data / Body', 'Response Data', 'Status']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for api in apis:
            writer.writerow(api)
            
    print(f"Successfully generated {csv_file} with {len(apis)} API endpoints.")
