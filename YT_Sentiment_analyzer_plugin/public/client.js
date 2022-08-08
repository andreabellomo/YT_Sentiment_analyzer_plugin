$(document).ready(() => {

    const sendDataToServer = () => {
        //prendiamo gli input

        const payload = {};
        input = $("#input1");

        payload["url"] = input.val();

        //request(payload).then((resp)=>{
        //    console.log("resp " + resp);
        //});
        const $contenitore = $("#risultati");
        if (payload["url"] != "") {

            fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then((response) => response.json())
                .then((data) => {
                    let html = "";
                    console.log(data[data.length - 1].result_of_video);
                    if (data[data.length - 1].result_of_video >= 0) {
                        $contenitore.css("background-color", "green");
                        html = "<h1> Lo Score del video è : " + data[data.length - 1].result_of_video + " ed è POSITIVO </h1>";
                    } else {
                        $contenitore.css("background-color", "red");
                        html = "<h1> Lo Score del video è : " + data[data.length - 1].result_of_video + " ed è NEGATIVO </h1> ";
                    }

                    $contenitore.html(html);
                })

        }

    };

    $("#btnSend").on("click", () => {

        if ($("#input1").val() != "") {

            $contenitore = $("#risultati");
            let html = "";
            html = "STO ELABORANDO IL VIDEO...";
            $contenitore.html(html);
            sendDataToServer();
        }
    });
});