class ApiGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def generate_controller
    template 'controller.rb', "app/controllers/#{name}_controller.rb"
    template 'test.rb', "test/controllers/#{name}_controller_test.rb"
  end

  private

  def api_name
    if name.pluralize.singularize == name
      "#{name.classify}"
    else
      "#{name.classify}s"
    end
  end

  def version
    name.include?('/') ? (name.split('/').first.upcase + '::') : ''
  end
end
