/// Formats a whole number of shillings as "KES 12,500".
String formatKes(int amount) {
  final digits = amount.abs().toString();
  final buffer = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) buffer.write(',');
    buffer.write(digits[i]);
  }
  return '${amount < 0 ? '-' : ''}KES $buffer';
}

/// Formats a count with thousands separators: 12500 -> "12,500".
String formatCount(int value) => formatKes(value).replaceFirst('KES ', '');

const List<String> _months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/// Formats a date as "5 Oct 2026".
String formatDate(DateTime date) => '${date.day} ${_months[date.month - 1]} ${date.year}';
