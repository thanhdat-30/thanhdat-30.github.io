<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bài tập 2</title>
</head>
<body>
    <h1>Kiểm tra học sinh đậu tốt nghiệp</h1>
    <form action="#" method="post">
        <p>Nhập điểm toán: <input type="text" name="Toan"></p>
        <p>Nhập điểm lý: <input type="text" name="Ly"></p>
        <p>Nhập điểm hóa: <input type="text" name="Hoa"></p>
        <p><input type="submit" value="Kết quả"></p>
    </form>

    <?php  
        if(isset($_POST["Toan"]) && isset($_POST["Ly"]) && isset($_POST["Hoa"])) {
            $Toan = $_POST["Toan"];
            $Ly = $_POST["Ly"];
            $Hoa = $_POST["Hoa"];
            $Tong = $Toan + $Ly + $Hoa;
            if($Toan == 0){
                echo "Tổng {$Tong} điểm. Bạn đã rớt tốt nghiệp!";
            }
            elseif($Ly == 0){
                echo "Tổng {$Tong} điểm. Bạn đã rớt tốt nghiệp";
            }
            elseif($Hoa == 0){
                echo "Tổng {$Tong} điểm. Bạn đã rớt tốt nghiệp";
            }
            else{
                if($Tong >= 15){
                    echo "Tổng {$Tong} điểm. Chúc mừng!!! Bạn đã đậu tốt nghiệp";
                }
                else {
                    echo "Tổng {$Tong} điểm. Bạn đã rớt tốt nghiệp";
                }
            }
        }
    ?>
</body>
</html>