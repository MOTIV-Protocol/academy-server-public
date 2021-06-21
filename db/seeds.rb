AdminUser.destroy_all

# 이전 업로드파일/데이터를 모두 삭제합니다.
FileUtils.remove_dir Rails.root.join("public/uploads") if Rails.root.join("public/uploads").directory?
puts "public/uploads cleared"

# 기존 DB를 모두 삭제합니다.
User.destroy_all
puts "User destroyed_all"
Category.destroy_all
puts "Category destroyed_all"
Lecture.destroy_all
puts "Lecture destroyed_all"
Order.destroy_all
puts "Order destroyed_all"
School.destroy_all
puts "School destroyed_all"
Like.destroy_all
puts "Like destroyed_all"
Faq.destroy_all
puts "FAQ destroyed_all"
PointHistory.destroy_all
puts "Point History destroyed_all"
Comment.destroy_all
puts "Comment history destroyed_all"
Attendance.destroy_all
puts "Attendance destroyed_all"
CalculateHistory.destroy_all
puts "CalculateHistory destroyed_all"
Coupon.destroy_all
puts "Coupon destroyed_all"

# 새로운 Seed 데이터를 만듭니다.
[User, Category, School, Lecture, Order, Review, Comment, Like, Faq, Event, PointHistory, Attendance, CalculateHistory].each do |cls|
  GenerateSeed.exec(cls)
end
