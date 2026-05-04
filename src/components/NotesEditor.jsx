import { Editor } from '@tinymce/tinymce-react';

export default function NotesEditor({ value, onChange, placeholder = 'Add your notes here...' }) {
  const handleEditorChange = (content) => {
    onChange(content);
  };

  return (
    <div className="space-y-2">
      <Editor
        apiKey={import.meta.env.VITE_TINY_MCE_EDITOR_API_KEY}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }',
          placeholder: placeholder,
          branding: false,
          statusbar: false
        }}
      />
      <p className="text-xs text-gray-500">
        💡 Use the rich text editor to format your notes with bold, lists, and more.
      </p>
    </div>
  );
}