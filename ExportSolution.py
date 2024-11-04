import os
import re

# Defaults
DEFAULT_FOLDER_PATH = r"/Users/rhishabhhattarki/Documents/code/open-world-ai/open-world-ai-ui"
DEFAULT_EXTENSIONS = {".js", ".jsx", ".css", ".html", ".txt", ".json", ".yaml", ".config", ".md"}
DEFAULT_TOKEN_LIMIT = 2_000_000  # ChatGPT-4 token limit approximation
DEFAULT_IGNORED_FOLDERS = {"node_modules", "venv", "__pycache__", ".git"}  # Add any folder names to be ignored
DEFAULT_IGNORED_FILES = {"package-lock.json", "LICENSE"}  # Add any file names to be ignored

def count_tokens(text):
    """
    Approximates the number of tokens in the text. For estimation, each word or symbol is considered as a token.
    Adjust as needed based on project specifics.
    """
    token_count = len(re.findall(r"\S+", text))
    print(f"Token count for current content: {token_count}")
    return token_count

def read_files_in_folder(folder_path, extensions, token_limit, ignored_folders, ignored_files):
    """
    Reads all files within the folder and its subdirectories, splitting contents into token-limited chunks.
    Returns a list of file dump strings, each within the token limit.
    """
    print(f"Starting to read files in folder: {folder_path}")
    file_dumps = []
    current_dump = ""
    current_tokens = 0
    file_counter = 1

    for root, dirs, files in os.walk(folder_path):
        # Remove ignored folders from the current directory traversal
        dirs[:] = [d for d in dirs if d not in ignored_folders]
        print(f"Entering directory: {root}")

        for file_name in files:
            # Skip ignored files
            if file_name in ignored_files:
                print(f"Skipping ignored file: {file_name}")
                continue

            # Process only files with the specified extensions
            if any(file_name.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file_name)
                print(f"Processing file: {file_path}")
                
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        file_content = f.read()
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")
                    continue  # Skip files that can't be read
                
                # Prepare file header for readability in each dump
                header = f"\n\n# FILE: {file_path}\n\n"
                file_content_with_header = header + file_content
                file_tokens = count_tokens(file_content_with_header)
                
                # Check if adding the file exceeds the token limit
                if current_tokens + file_tokens > token_limit:
                    print(f"Token limit reached. Saving current dump with {current_tokens} tokens.")
                    # Save current dump and start a new one
                    file_dumps.append(current_dump)
                    current_dump = ""
                    current_tokens = 0
                    file_counter += 1
                
                # Add file content to the current dump
                current_dump += file_content_with_header
                current_tokens += file_tokens
                print(f"Added {file_tokens} tokens from file '{file_name}' to the current dump. Total tokens in dump: {current_tokens}")
            else:
                print(f"Skipping file with unsupported extension: {file_name}")

    # Add any remaining content as the final dump
    if current_dump:
        print(f"Finalizing and saving last dump with {current_tokens} tokens.")
        file_dumps.append(current_dump)

    return file_dumps

def save_dumps_to_files(file_dumps, output_folder="file_dumps"):
    """
    Saves each file dump string to a separate output file within the specified output folder.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"Created output folder: {output_folder}")
    
    for idx, dump_content in enumerate(file_dumps, start=1):
        output_file_path = os.path.join(output_folder, f"file_dump_{idx}.txt")
        with open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.write(dump_content)
        print(f"Saved dump {idx} to file: {output_file_path}")

def main(
    folder_path=DEFAULT_FOLDER_PATH,
    extensions=DEFAULT_EXTENSIONS,
    token_limit=DEFAULT_TOKEN_LIMIT,
    ignored_folders=DEFAULT_IGNORED_FOLDERS,
    ignored_files=DEFAULT_IGNORED_FILES
):
    print("Reading files from:", folder_path)
    print("Extensions:", extensions)
    print("Token limit per file dump:", token_limit)
    print("Ignored folders:", ignored_folders)
    print("Ignored files:", ignored_files)
    
    file_dumps = read_files_in_folder(folder_path, extensions, token_limit, ignored_folders, ignored_files)
    save_dumps_to_files(file_dumps)
    print("All file dumps have been saved.")

if __name__ == "__main__":
    # Run with defaults; you can replace with desired values.
    main()
