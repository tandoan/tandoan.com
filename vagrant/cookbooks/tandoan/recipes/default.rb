include_recipe "apache2"
include_recipe "php"

web_app "tandoan" do
  server_name "tandoan.com"
  server_aliases ["www.tandoan.com"]
  docroot "/home/vagrant/tandoan/html/"
  php_include_path "/home/vagrant/tandoan/vendor/"
end

